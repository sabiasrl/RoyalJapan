// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { useCart } from '@/app/context/CartContext';
import { useI18n } from '@/app/i18n/I18nContext';

function Header(){
    const [show, setShow] = useState(false)
    // const navigate = useNavigate()
    const router = useRouter()
    const { t } = useI18n();
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    const goHome = ()=>{
        
        let id = localStorage.getItem("userID");
        router.push(`/${id}`)
    }

    const goToCart = (e) => {
        e.preventDefault();
        router.push('/cart');
    }
     return (
      
        <>
            <header>
                <div className="logo">
                    <a href="/"><img src="/assets/images/header-logo.png" className="pc" alt=""/><img src="/assets/images/header_logo_sp.svg" className="sp" alt=""/></a>
                </div>
                <div className="menu pc">
                    {/* <a href="/" className="menu-item">HOME</a>
                    <a href="/product" className="menu-item">商品一覧</a>
                    <a href="/" className="menu-item">当サイトについて</a>
                    <a href="/" className="menu-item">お客様の声</a>
                    <a href="/" className="menu-item">Q&A</a> */}
                </div>
                <div className="cart pc">
                    <a href="/cart" onClick={goToCart} className="cart-item">
                        <img src="/assets/images/Intersection.svg" alt=""/>
                    </a>
                    {cartCount > 0 && <div className="badge">{cartCount}</div>}
                </div>
                <div onClick={()=>setShow(true)} className="navMenu sp" id="navMenu">
                    <span>MENU</span>
                    <div className="menuItem">
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                </div>
            </header>

            <div id="sideMenu" className={`sideMenu ${show?"show":""}`}>
                <div className="sidelogo">
                    <img src="/assets//images/header_logo_sp.svg" alt=""/>
                </div>
                <div onClick={()=>setShow(false)} className="close" id="closeMenu">
                    <div className="close-item">
                    </div>
                    <span>{t('common.close')}</span>
                </div>
                <div className="sidemenu-part">
                    <a onClick={()=>goHome()} className="sidemenu-item">
                        <img src="/assets/images/icon-heart.svg" alt=""/>
                        <p>{t('header.home')}</p>
                    </a>
                    {/* <a href="" className="sidemenu-item">
                        <img src="/assets/images/icon-about.svg" alt=""/>
                        <p>私たちについて</p>
                    </a>
                    <a href="" className="sidemenu-item">
                        <img src="/assets/images/Icon-home.svg" alt=""/>
                        <p>お支払い方法</p>
                    </a> */}
                    <a href="/delivery" className="sidemenu-item">
                        <img src="/assets/images/icon-face.svg" alt=""/>
                        <p>{t('header.delivery')}</p>
                    </a>
                    <a href="/specified" className="sidemenu-item">
                        <img src="/assets/images/icon-comment.svg" alt=""/>
                        <p>{t('header.legal')}</p>
                    </a>
                    <a href="/personal" className="sidemenu-item">
                        <img src="/assets/images/icon-bell.svg" alt=""/>
                        <p>{t('header.personalImport')}</p>
                    </a>
                    <a href="/privacy" className="sidemenu-item">
                        <img src="/assets/images/icon-person.svg" alt=""/>
                        <p>{t('header.privacy')}</p>
                    </a>
                </div>
                <div className="sidemenu-footer">
                    {t('header.footer')}<br/><br/>
                    <span>{t('header.footerDescription')}</span>
                </div>
            </div>
        </>
    )
}

export default Header;