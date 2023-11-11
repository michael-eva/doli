import listings from '../data/listings.json'
import { Card } from '../components/Card';

export default function Home() {
    return (
        <div className='flex flex-wrap justify-center h-full'>
            {
                listings.map(item => {
                    return <div key={item.id} className='mt-10 '>
                        <Card {...item} />
                    </div>
                })
            }
        </div>

    )

}
