export default function handler(req,res){res.setHeader('Cache-Control','no-store');res.status(200).json({ai:Boolean(process.env.AI_GATEWAY_API_KEY),model:'openai/gpt-5-mini',mode:'configured'});}
