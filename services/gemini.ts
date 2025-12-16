import { GoogleGenAI } from "@google/genai";
import { Lead, QuoteItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface LeadAnalysis {
  score: number;
  summary: string;
  nextAction: string;
  dealProbability: string;
}

export const analyzeLead = async (lead: Lead): Promise<LeadAnalysis> => {
  try {
    const prompt = `
      Tu es un Analyste CRM Senior pour une Agence Digitale B2B.
      Analyse les données du lead suivant provenant de notre site web et GA4.
      
      Lead: ${lead.firstName} ${lead.lastName} de ${lead.company} (${lead.position}).
      Canal d'acquisition: ${lead.channel}.
      Données GA4: A visité ${lead.gaData.pagesVisited.join(', ')}. Temps sur site: ${lead.gaData.timeOnSite}s. Page d'atterrissage: ${lead.gaData.landingPage}.
      Statut actuel: ${lead.status}.
      Potentiel de la transaction: €${lead.value}.
      Nombre d'interactions historiques: ${lead.interactions.length}.

      Fournis une réponse strictement en JSON avec les champs suivants (tout le contenu texte doit être en FRANÇAIS) :
      1. score: Un nombre entre 0-100 indiquant la qualité du lead.
      2. summary: Une analyse d'une phrase sur leur intention basée sur les pages visitées et le canal.
      3. nextAction: La meilleure prochaine action commerciale spécifique (ex: "Envoyer l'étude de cas X", "Appeler maintenant").
      4. dealProbability: Un pourcentage en chaîne de caractères (ex: "65%").
      
      Output strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as LeadAnalysis;

  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      score: 50,
      summary: "Impossible d'analyser le lead pour le moment.",
      nextAction: "Revue manuelle",
      dealProbability: "Inconnu"
    };
  }
};

export const generateQuoteSuggestion = async (lead: Lead): Promise<string> => {
    try {
        const prompt = `
          Génère un corps d'email court, percutant et personnalisé pour envoyer un devis à ce lead.
          Contexte : Nous sommes une agence digitale.
          Lead : ${lead.firstName} de ${lead.company}.
          Centres d'intérêt basés sur l'historique : ${lead.gaData.pagesVisited.join(', ')}.
          Ton : Professionnel mais moderne et direct.
          Langue : Français.
          Ne pas inclure l'objet de l'email.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Le brouillon n'a pas pu être généré.";
    } catch (error) {
        return "Erreur lors de la génération du brouillon.";
    }
}

export const generateQuote = async (lead: Lead): Promise<QuoteItem[]> => {
    try {
        const prompt = `
            Agis comme un directeur commercial expert. Génère une liste d'articles de devis (services) pour ce lead, basée sur son secteur et ses pages visitées.
            
            Client: ${lead.company}
            Secteur probable (déduit du nom): Inconnu, devine le mieux possible.
            Pages visitées: ${lead.gaData.pagesVisited.join(', ')}.
            Budget estimé: ${lead.value}€.

            Règles:
            1. Crée 3 à 5 lignes de services pertinents (ex: "Audit SEO", "Développement Landing Page", "Setup Campagne Ads").
            2. Les prix doivent être réalistes et totaliser environ ${lead.value}€.
            3. Langue: Français.
            4. Retourne UNIQUEMENT un tableau JSON.
            
            Format attendu:
            [
                { "description": "Nom du service", "quantity": 1, "unitPrice": 1000, "total": 1000 }
            ]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text) as QuoteItem[];
    } catch (error) {
        console.error("Failed to generate quote", error);
        return [];
    }
}