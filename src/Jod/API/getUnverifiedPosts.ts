
async function getUnverifiedPosts() {
    
    try {
        const response = await fetch('/.netlify/functions/getPosts?eq=isVerified&value=false')
        if (!response.ok) {
            throw new Error('Failed to fetch data from serverless function');
        }
        const data = await response.json();
        // console.log('Data from serverless function:', data);
        return data
    } catch (error) {
        console.error(error);
    }
}

export {getUnverifiedPosts}