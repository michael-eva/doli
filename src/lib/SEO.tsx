import { Helmet } from "react-helmet-async"
type SEOProps = {
    title: string, description: string, type: string, name: string
}
export default function SEO({ title, description, type, name }: SEOProps) {
    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            { /* End standard metadata tags */}
            { /* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="fb:app_id" content="785444670112157" />
            <meta property="og:url" content="https://doli.com.au" />
            <meta property="og:image" content="https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/sign/website-images/doli_logo.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlLWltYWdlcy9kb2xpX2xvZ28uanBnIiwiaWF0IjoxNzEwMzkzNDg2LCJleHAiOjE3NDE5Mjk0ODZ9.virevU3v1QYzULFqmcMUgAlpT2Bp3E82Ro8oEYNtwvI&t=2024-03-14T05%3A18%3A06.226Z" />
            <meta property="og:site_name" content="doli" />
            { /* End Facebook tags */}
            { /* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta property="twitter:url" content="https://doli.com.au" />
            <meta name="twitter:image" content="https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/sign/website-images/doli_logo.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlLWltYWdlcy9kb2xpX2xvZ28uanBnIiwiaWF0IjoxNzEwMzkzNDg2LCJleHAiOjE3NDE5Mjk0ODZ9.virevU3v1QYzULFqmcMUgAlpT2Bp3E82Ro8oEYNtwvI&t=2024-03-14T05%3A18%3A06.226Z" />
            { /* End Twitter tags */}
        </Helmet>
    )
}