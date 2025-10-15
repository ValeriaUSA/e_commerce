import CartData from "./CartData.jsx"

//This component accepts propsfor state mngmnt: the cart menu is open, yes:no?
const CartOffcanvas = ({ isOpen, toggleOffcanvas }) => {

    return (

        <>
            <div
                className={`offcanvas offcanvas-end fade ${isOpen ? 'show' : ''}`}
                tabIndex='-1' //preventing accidental focus, only via JS
                id='offcanvasRight'
                aria-labelledby="offcanvasRightLabel"
            >

                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">Books in your Cart</h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={toggleOffcanvas} // Uses the prop function to close
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <CartData />
                </div>


            </div>

{/* Backdrop renders only when open, and closes the cart on click */}
            {isOpen && <div className="offcanvas-backdrop fade show" onClick={toggleOffcanvas}></div>}
        </>
    );
};

export default CartOffcanvas