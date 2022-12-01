import useFetch from "../hooks/useFetch";
import BookInfoModal from "../components/BookInfoModal";
import { useState } from "react";
import capitaliseFirstLetter from "../hooks/capitaliseFirstLetter";
import Loading from "../components/Loading";
import LoadingFailed from "../components/LoadingFailed";


const Bestsellers = ( {addShelf, shelf, removeFromShelf} ) => {

    const [isOpen, setIsOpen] = useState(false)
    const [bookModal, setBookModal] = useState([])

    const API_KEY = "SlheFCnWidTnyJMGcupkk6FkcZYvN62F";

    //! Fetch Data: Bestsellers in different categories (about 10-15 books)
    const { data, status } = useFetch(`https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${API_KEY}`)
    
    if (status === "loading") return <Loading />;
    if (status === "error") return <LoadingFailed />;

    //! Save Icons
    const bookmarkIconOutline = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
    const bookmarkIconSolid = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" /></svg>
    
    //! Open Pop up
    const handleClick = (title, img, description, amazon, author) => {
        setBookModal([title, img, description, amazon, author])
        setIsOpen(true)
    };

    //! Add/remove items to/fro bookshelf
    const handleShelf = (title, img, description, amazon, author) => {
        // Find the index of item in shelf (if any)
        const getIndex = () => {
            for (let item of shelf) {
                if (item[0] === title) {
                    let i = shelf.indexOf(item)
                    console.log("index", i)
                    return i
                } else {
                    continue
                }
            }
        }
        // If item is in shelf, remove it, otherwise add it to shelf
        shelf.some(ele => ele[0] === title) ? removeFromShelf(getIndex())
        : addShelf([title, img, description, amazon, author])
    };

    //! Get The Books by Categories
    const getBooksByCategories = (num) => {
        const booksByCategories = data?.results?.lists[num]?.books?.map(item => {
            return (
                <div data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-in-out" data-aos-once="true"
                className="flex-shrink-0 w-1/6 ml-16">
                    <img onClick={() => handleClick(item?.title, item?.book_image, item?.description, item?.amazon_product_url, item?.author)}
                    key={item?.title}
                    src={item?.book_image}
                    className="cursor-pointer -z-10 hover:opacity-50 hover:z-0 transition duration-300 ease-in-out"/>
                    <h3 onClick={() => handleClick(item?.title, item?.book_image, item?.description, item?.amazon_product_url, item?.author)}
                    className="py-2 cursor-pointer">{capitaliseFirstLetter(item?.title)}</h3>
                    <h4 className="hover:opacity-50 cursor-pointer transition duration-300 ease-in-out">{item?.author}</h4>
                    <p className="py-2 pb-4">{item?.description}</p>
                    <button 
                    className="hover:opacity-50 transition duration-300 ease-in-out"
                    onClick={() => handleShelf(item?.title, item?.book_image, item?.description, item?.amazon_product_url, item?.author)}
                    >{shelf.some(title => title[0] === item?.title) ? bookmarkIconSolid : bookmarkIconOutline}
                    </button>
                </div>

            );
        });
            return booksByCategories
    };

    //! Laying out the Books
    const displayBooks = (name, num) => {
        return (
            <>
                <div data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-in-out" data-aos-once="true"
                className="text-left py-8 ml-16 flex">
                    <h2>{name}</h2>
                    <p className="font-sans-serif">{getBooksByCategories(num)?.length}</p>
                </div>
                <hr data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-in-out" data-aos-once="true"
                className="mx-16 mb-8 border-fgreen"></hr>
                <div className="flex overflow-x-scroll space-x-8">
                    {getBooksByCategories(num)}   
                </div>
            </>
        );
    };

    const booksToDisplay = [
        ["Fiction", 0],
        ["Non-Fiction", 1],
        ["Advice, How-To", 6],
        ["Series", 9],
        ["Young-Adult", 10],
        ["Business", 13],
        ["Graphic and Mangas", 14]
    ]

    return (
        <div>

        <BookInfoModal open={isOpen} bookModal={bookModal} onClose={() => setIsOpen(false)} shelf={shelf} addShelf={addShelf} removeFromShelf={removeFromShelf}>
        </BookInfoModal>

        <div className="bg-pale-yellow">
            <h1 data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-in-out" data-aos-once="true"
            className="text-center pt-16">Recomended</h1>
            {booksToDisplay.map((item) => {
                return displayBooks(item[0], item[1])
            })}
         </div>
        </div>
    );
}
 
export default Bestsellers;