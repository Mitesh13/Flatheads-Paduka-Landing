
let currentItem;
let cart;

function init()
{
    /** This function sets the values that are given from the previous pages but as we dont have previous page, 
        I've set it from here
    */
    const getCurrentItem = () =>{
        return {
            id: 101,
            name: 'Paduka',
            price: 2000,
            quantity: 1,
            febric: 'bamboo',
            colors: ['brown','blue','black','white'],
            image: './Flatheads Assignment Assets/banner-option_1.jpg'
        }
    }
    currentItem= getCurrentItem()

    //Let's say sessionStorage is an API call
    cart = JSON.parse(sessionStorage.getItem('cart'))
    sessionStorage.setItem('cart',JSON.stringify({
        products: [],
        subtotal: 0,
        totalAmount: 0
    }))
    sessionStorage.setItem('discountCodes',JSON.stringify(
    [
        {
            name: 'FirstBuy',
            discount: 300,
            applied: false
        },
        {
            name: 'FlatheadsHoli',
            discount: 200,
            applied: false
        }
    ]))
}
init()

function changeQty(product, op){
    // Changes qunatity   
    cart.products.forEach((p)=>{
        if(p.id==product && (p.quantity>0 || op==='++'))
        {
            eval(`p.quantity${op}`)
            
            return            
        }
    })
    renderCart()
}

$('.cart-btn button').click((e)=>{
    $('.cart').toggle()
    showCart()  
})

const showCart = () =>{
    if(cart.products.length && cart.products.filter(p=>p.id===currentItem.id))
        console.log("already inside cart");    
    else{
        addToCart()
    }
    renderCart()
}

const renderCart = () =>{
    cart.subtotal = 0
    cart.totalAmount = 0
    cart.products.forEach((product,index)=>{
        
        $('.cart .products').empty().append(`
            <div class='cart-product'>
                <span>${index+1}.</span>
                <div class='prod-img'>
                    <img src="${product.image}" height="30" />
                </div>
                <p>${product.name}</p>
                <div>
                    <button id='qty-inc' onclick=changeQty(${product.id},'++')>+</button>
                    <span id='product-qty'>${product.quantity}</span>
                    <button id='qty-dec' onclick=changeQty(${product.id},'--')>-</button>
                </div>   
            </div>

        `)

        cart.subtotal += (product.price * product.quantity)
        cart.totalAmount = cart.subtotal
    })
    $('.cart .subtotal').empty().append(cart.subtotal)    
    $('.cart .total-amount').empty().append(cart.totalAmount)    

    $('#verify-code-btn').click(()=>{
        
        let discountCodes = JSON.parse(sessionStorage.getItem('discountCodes'))
        
        for(let code=0; code < discountCodes.length; code++)
        {
            if(discountCodes[code].name == $('.discount-code').val() && !discountCodes[code].applied)
            {
                cart.totalAmount = cart.totalAmount - discountCodes[code].discount
                $('.cart .total-amount').empty().append(cart.totalAmount)    
                discountCodes[code].applied = true
                sessionStorage.setItem('discountCodes',JSON.stringify(discountCodes))
                return
            }
        }
    })
}

const addToCart = () =>{
    cart.products = [...cart.products, currentItem]
    sessionStorage.setItem('cart',JSON.stringify(cart))
}

$('#checkout-btn').click(()=>
{
    sessionStorage.setItem('cart',JSON.stringify(cart))
    let items = cart.products.reduce((sum, p) => sum + p.quantity,0)
    alert("Items: "+items +"\nTotal amount: "+cart.totalAmount)
})

$('#close-btn').click(()=>
{
    $('.cart').toggle()
})