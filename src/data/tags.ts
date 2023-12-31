type TagsType = {
    value: string,
    label: string
}

const tags: string[] = [
    "Asian", 'Baked Goods', 'BBQ', "Beer", "Beverages", "Bread", "Burgers", "BYO", "Cakes", "Catering", "Charcoal Chicken", "Cheeses", "Chinese", 'Cider', 'Cocktails', 'Coffee', 'Coffee Beans', 'Confectionary', 'Continental', 'Deli Goods', 'Desserts', 'Doughnuts', 'Drive Thru', "Dumplings", 'English', 'European', 'Fine Dining', 'Fish & Chips', 'French', 'Fried Chicken', 'Fromagerie', 'Fruit & Veggies', 'German', 'Gin', 'Gluten Free', 'Greek', 'Grill', 'Halal', 'Hampers', 'Ice Cream', 'Indian', 'Indonesian', 'Israeli', 'Italian', 'Japanese', 'Jewish', 'Kebab', 'Kitchen', 'Korean', 'Kosher', 'Latin American', 'Lebanese', 'Licensed', 'Live Music', 'Malaysiain', 'Meats', 'Mediterranean', "Mexican", 'Middle Eastern', 'Modern Australian', 'North American', 'Organic', 'Pakistani', 'Pantry Items', 'Pasta', 'Pastries', 'Pizza', 'Plant Based', 'Pub Classics', 'Salads', 'Sandwiches', 'Seafood', 'South American', 'Souvlaki', 'Spanish', 'Spirits', 'Sri Lankan', 'Sushi', 'Tapas', 'Thai', 'Turksih', 'Vegan', 'Vegetarian', 'Vietnamese', 'Wholefoods', 'Whisky', 'Wine', 'Yum Cha']
// export default tags
const transformedTags: TagsType[] = tags.map((tag) => ({
    value: tag.toLowerCase(),
    label: tag
}));

export default transformedTags
