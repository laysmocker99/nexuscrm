// =====================================================
// Supabase Edge Function - Gemini AI
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadAnalysisRequest {
  action: "analyze-lead";
  lead: any;
}

interface GenerateEmailRequest {
  action: "generate-email";
  lead: any;
}

interface GenerateQuoteRequest {
  action: "generate-quote";
  lead: any;
}

type GeminiRequest = LeadAnalysisRequest | GenerateEmailRequest | GenerateQuoteRequest;

// =====================================================
// Helper: Call Gemini API
// =====================================================
async function callGemini(prompt: string, jsonMode = false) {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: jsonMode
        ? {
            responseMimeType: "application/json",
          }
        : {},
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response from Gemini AI");
  }

  return text;
}

// =====================================================
// Action: Analyze Lead
// =====================================================
async function analyzeLead(lead: any) {
  const prompt = `
    Tu es un Analyste CRM Senior pour une Agence Digitale B2B.
    Analyse les données du lead suivant provenant de notre site web et GA4.

    Lead: ${lead.first_name || lead.firstName} ${lead.last_name || lead.lastName} de ${lead.company} (${lead.position}).
    Canal d'acquisition: ${lead.channel}.
    Données GA4: A visité ${lead.ga_data?.pagesVisited?.join(', ') || lead.gaData?.pagesVisited?.join(', ') || 'aucune page'}.
    Temps sur site: ${lead.ga_data?.timeOnSite || lead.gaData?.timeOnSite || 0}s.
    Page d'atterrissage: ${lead.ga_data?.landingPage || lead.gaData?.landingPage || 'inconnue'}.
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

  const text = await callGemini(prompt, true);
  return JSON.parse(text);
}

// =====================================================
// Action: Generate Email
// =====================================================
async function generateEmail(lead: any) {
  const prompt = `
    Génère un corps d'email court, percutant et personnalisé pour envoyer un devis à ce lead.
    Contexte : Nous sommes une agence digitale.
    Lead : ${lead.first_name || lead.firstName} de ${lead.company}.
    Centres d'intérêt basés sur l'historique : ${lead.ga_data?.pagesVisited?.join(', ') || lead.gaData?.pagesVisited?.join(', ') || 'non disponibles'}.
    Ton : Professionnel mais moderne et direct.
    Langue : Français.
    Ne pas inclure l'objet de l'email.
  `;

  const text = await callGemini(prompt, false);
  return { emailDraft: text };
}

// =====================================================
// Action: Generate Quote
// =====================================================
async function generateQuote(lead: any) {
  const prompt = `
    Agis comme un directeur commercial expert. Génère une liste d'articles de devis (services) pour ce lead, basée sur son secteur et ses pages visitées.

    Client: ${lead.company}
    Secteur probable (déduit du nom): Inconnu, devine le mieux possible.
    Pages visitées: ${lead.ga_data?.pagesVisited?.join(', ') || lead.gaData?.pagesVisited?.join(', ') || 'non disponibles'}.
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

  const text = await callGemini(prompt, true);
  const items = JSON.parse(text);
  return { items };
}

// =====================================================
// Main Handler
// =====================================================
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check API key
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    // Parse request
    const body: GeminiRequest = await req.json();

    let result;

    switch (body.action) {
      case "analyze-lead":
        result = await analyzeLead(body.lead);
        break;

      case "generate-email":
        result = await generateEmail(body.lead);
        break;

      case "generate-quote":
        result = await generateQuote(body.lead);
        break;

      default:
        throw new Error(`Unknown action: ${(body as any).action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge Function error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        fallback:
          body.action === "analyze-lead"
            ? {
                score: 50,
                summary: "Impossible d'analyser le lead pour le moment.",
                nextAction: "Revue manuelle",
                dealProbability: "Inconnu",
              }
            : body.action === "generate-email"
            ? { emailDraft: "Erreur lors de la génération du brouillon." }
            : { items: [] },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
