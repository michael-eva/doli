const RESEND_API_KEY = "re_UdCZMpjw_6cfmHXyNCZUBy5SFF4KrPdgF";

export async function handler(event: any) {
  try {
const requestBody = JSON.parse(event.body)
const email = requestBody.email
    const response = await sendEmail(email);

    if (response.ok) {
      const data = await response.json();
      console.log('Data from Resend API:', data);
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } else {
      throw new Error('Failed to fetch data from Resend API');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}

async function sendEmail(email: string): Promise<Response> {
  const url = 'https://api.resend.com/emails';
  const payload = {
    from: 'doli <noreply@doli.com.au>',
    to: [email],
    subject: 'Your listing has been verified!',
    html: "<body style='background-color:rgb(255,255,255);margin-top:3rem;margin-bottom:3rem'><table align='center' width='100%' border='0' cellPadding='0' cellSpacing='0' role='presentation' style='max-width:37.5em;padding:2rem;border-radius:0.5rem;box-shadow:0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0,0,0,0.1), 0 4px 6px -4px rgb(0,0,0,0.1)'><tbody><tr style='width:100%'><td><h1 class=' style='font-size:1.25rem;line-height:1.75rem;padding-top:1rem'>Congratulations 🎉</h1><p style='font-size:1.125rem;line-height:1.75rem;margin:16px 0;font-weight:500;color:rgb(55,65,81)'>Your business listing with doli has been verified ✅</p><p style='font-size:1.125rem;line-height:1.75rem;margin:16px 0;font-weight:500;color:rgb(55,65,81)'>Click the link below to view your listing:</p><a href='https://doli.com.au' style='background-color:#656ee8;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:40%;padding:10px 10px 10px 10px;line-height:100%;max-width:100%' target='_blank'><span><!--[if mso]><i style='letter-spacing: 10px;mso-font-width:-100%;mso-text-raise:15' hidden>&nbsp;</i><![endif]--></span><span style='max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px'>Visit doli</span><span><!--[if mso]><i style='letter-spacing: 10px;mso-font-width:-100%' hidden>&nbsp;</i><![endif]--></span></a><p style='font-size:1.125rem;line-height:1.75rem;margin:16px 0;font-weight:500;color:rgb(55,65,81);margin-bottom:0px'>Stay Awesome</p><p style='font-size:1.125rem;line-height:1.75rem;margin:0px;font-weight:500;color:rgb(55,65,81)'>Team doli</p></td></tr></tbody></table></body>"
  };

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
}
