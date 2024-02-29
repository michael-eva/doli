import { Body, Html, Container, Tailwind, Text, Button, Img, Heading, Head } from "@react-email/components";

export default function SuccessfulVerification() {
    const button = {
        backgroundColor: "#656ee8",
        borderRadius: "5px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        textDecoration: "none",
        textAlign: "center" as const,
        display: "block",
        width: "40%",
        padding: "10px",
    };
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className=" bg-white my-12">
                    <Container className="p-8 rounded-lg shadow-lg">
                        <Heading className="text-xl pt-4">Congratulations  🎉</Heading>
                        <Text className="text-lg font-medium text-gray-700">Your business listing with doli has been verified ✅</Text>
                        <Text className="text-lg font-medium text-gray-700">Click the link below to view your listing:</Text>
                        <Button href="https://doli.com.au" style={button}>Visit doli</Button>
                        <Text className="text-lg font-medium text-gray-700 mb-0">Stay Awesome</Text>
                        <Text className="text-lg font-medium text-gray-700 m-0">Team doli</Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}


