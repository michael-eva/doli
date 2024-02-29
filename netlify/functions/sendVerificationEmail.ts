import { Resend } from 'resend';
import SuccessfulVerification from '../../src/Email/SuccessfulVerification';

const resend = new Resend(process.env.VITE_REACT_APP_RESEND_API_KEY);
export async function handler(event: any, context: any) {
  const email = event.queryStringParameters.email

  try {
    const { data, error } = await resend.emails.send({
      from: 'doli <noreply@doli.com.au>',
      to: [email],
      subject: 'Your listing has been verified!',
      react: SuccessfulVerification(),
    //   html: "<strong>Working</strong>"
    });

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send email' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
}