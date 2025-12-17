import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.use(authenticateToken);

// Analyze lead
router.post('/analyze-lead', async (req, res) => {
  try {
    const { lead } = req.body;

    if (!lead) {
      return res.status(400).json({ error: 'Lead data is required' });
    }

    const prompt = `
      Tu es un Analyste CRM Senior pour une Agence Digitale B2B.
      Analyse les données du lead suivant provenant de notre site web et GA4.

      Lead: ${lead.firstName} ${lead.lastName} de ${lead.company} (${lead.position}).
      Canal d'acquisition: ${lead.channel}.
      Données GA4: A visité ${lead.gaData?.pagesVisited?.join(', ') || 'aucune page'}. Temps sur site: ${lead.gaData?.timeOnSite || 0}s. Page d'atterrissage: ${lead.gaData?.landingPage || 'inconnue'}.
      Statut actuel: ${lead.status}.
      Potentiel de la transaction: €${lead.value}.
      Nombre d'interactions historiques: ${lead.interactions?.length || 0}.

      Fournis une réponse strictement en JSON avec les champs suivants (tout le contenu texte doit être en FRANÇAIS) :
      1. score: Un nombre entre 0-100 indiquant la qualité du lead.
      2. summary: Une analyse d'une phrase sur leur intention basée sur les pages visitées et le canal.
      3. nextAction: La meilleure prochaine action commerciale spécifique (ex: "Envoyer l'étude de cas X", "Appeler maintenant").
      4. dealProbability: Un pourcentage en chaîne de caractères (ex: "65%").

      Output strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const analysis = JSON.parse(text);
    res.json(analysis);

  } catch (error) {
    console.error("AI Analysis failed:", error);
    res.status(500).json({
      error: 'AI analysis failed',
      fallback: {
        score: 50,
        summary: "Impossible d'analyser le lead pour le moment.",
        nextAction: "Revue manuelle",
        dealProbability: "Inconnu"
      }
    });
  }
});

// Generate email suggestion
router.post('/generate-email', async (req, res) => {
  try {
    const { lead } = req.body;

    if (!lead) {
      return res.status(400).json({ error: 'Lead data is required' });
    }

    const prompt = `
      Génère un corps d'email court, percutant et personnalisé pour envoyer un devis à ce lead.
      Contexte : Nous sommes une agence digitale.
      Lead : ${lead.firstName} de ${lead.company}.
      Centres d'intérêt basés sur l'historique : ${lead.gaData?.pagesVisited?.join(', ') || 'non disponibles'}.
      Ton : Professionnel mais moderne et direct.
      Langue : Français.
      Ne pas inclure l'objet de l'email.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    const emailDraft = response.text || "Le brouillon n'a pas pu être généré.";
    res.json({ emailDraft });

  } catch (error) {
    console.error("Email generation failed:", error);
    res.status(500).json({
      error: 'Email generation failed',
      emailDraft: "Erreur lors de la génération du brouillon."
    });
  }
});

// Generate quote
router.post('/generate-quote', async (req, res) => {
  try {
    const { lead } = req.body;

    if (!lead) {
      return res.status(400).json({ error: 'Lead data is required' });
    }

    const prompt = `
      Agis comme un directeur commercial expert. Génère une liste d'articles de devis (services) pour ce lead, basée sur son secteur et ses pages visitées.

      Client: ${lead.company}
      Secteur probable (déduit du nom): Inconnu, devine le mieux possible.
      Pages visitées: ${lead.gaData?.pagesVisited?.join(', ') || 'non disponibles'}.
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
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
      return res.json({ items: [] });
    }

    const items = JSON.parse(text);
    res.json({ items });

  } catch (error) {
    console.error("Quote generation failed:", error);
    res.status(500).json({
      error: 'Quote generation failed',
      items: []
    });
  }
});

export default router;
