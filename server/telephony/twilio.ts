import crypto from 'crypto';
import { Agent } from '../../src/types/index.ts';
import { TelephonyProvider, LANGUAGE_VOICE_MAP } from './provider.ts';

export class TwilioTelephonyProvider implements TelephonyProvider {
  name: 'twilio' = 'twilio';

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  generateInitialCallResponse(agent: Agent, baseUrl: string, callSid: string): string {
    const config = LANGUAGE_VOICE_MAP[agent.language] || LANGUAGE_VOICE_MAP.en;
    const gatherAction = `${baseUrl}/api/webhooks/twilio/gather?agentId=${encodeURIComponent(agent.id)}&callSid=${encodeURIComponent(callSid)}`;
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${this.escapeXml(gatherAction)}" method="POST" speechTimeout="auto" timeout="4" language="${config.languageCode}">
    <Say voice="${config.voice}" language="${config.languageCode}">${this.escapeXml(agent.greeting)}</Say>
  </Gather>
  <Say voice="${config.voice}" language="${config.languageCode}">We did not hear a response. Goodbye!</Say>
  <Hangup/>
</Response>`;
  }

  generateTurnResponse(
    agent: Agent,
    spokenText: string,
    action: 'continue' | 'transfer' | 'hangup',
    baseUrl: string,
    callSid: string
  ): string {
    const config = LANGUAGE_VOICE_MAP[agent.language] || LANGUAGE_VOICE_MAP.en;
    const cleanSpeech = this.escapeXml(spokenText);

    if (action === 'transfer') {
      const handoffPhoneClean = this.escapeXml(agent.handoffPhone.replace(/[^\d+]/g, ''));
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${config.voice}" language="${config.languageCode}">${cleanSpeech}</Say>
  <Dial timeout="25">
    <Number>${handoffPhoneClean}</Number>
  </Dial>
</Response>`;
    }

    if (action === 'hangup') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${config.voice}" language="${config.languageCode}">${cleanSpeech}</Say>
  <Hangup/>
</Response>`;
    }

    const gatherAction = `${baseUrl}/api/webhooks/twilio/gather?agentId=${encodeURIComponent(agent.id)}&callSid=${encodeURIComponent(callSid)}`;
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${this.escapeXml(gatherAction)}" method="POST" speechTimeout="auto" timeout="4" language="${config.languageCode}">
    <Say voice="${config.voice}" language="${config.languageCode}">${cleanSpeech}</Say>
  </Gather>
  <Say voice="${config.voice}" language="${config.languageCode}">Have a wonderful day!</Say>
  <Hangup/>
</Response>`;
  }

  verifySignature(url: string, params: Record<string, string>, signatureHeader?: string): boolean {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (process.env.VERIFY_TWILIO_SIGNATURE !== 'true' || !authToken || !signatureHeader) return true;

    try {
      const sortedKeys = Object.keys(params).sort();
      let data = url;
      for (const key of sortedKeys) data += key + params[key];
      const expectedSignature = crypto.createHmac('sha1', authToken).update(Buffer.from(data, 'utf-8')).digest('base64');
      return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signatureHeader));
    } catch {
      return false;
    }
  }
}

export const twilioProvider = new TwilioTelephonyProvider();