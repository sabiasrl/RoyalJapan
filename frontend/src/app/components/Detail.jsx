'use client'
import { useState, useEffect } from "react"
import axios from 'axios';
import { useI18n } from '@/app/i18n/I18nContext';
import { mockApi, mockProducts } from '@/app/utils/mockApi';
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
function Detail({id, user, coupon, count, setPrice}){
    const { t } = useI18n();
    const [price_sell, setPriceSell] = useState(0);
    const [price_id, setPriceId] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [percent, setPercent] = useState(0);
    const [subtitile, setSubTitle] = useState("");

    useEffect(()=>{
        getProductData()       
    },[])
    const getProductData = ()=>{      
        let config = {
            method: 'get',
            url: `${baseurl}/api/product/${id}`,
        };
        axios(config)
        .then(async (response) => {
            const productPrice = parseInt(response.data.price_sell) || 0;
            setPriceSell(productPrice);
            setPriceId(response.data.price_id);
            setDescription(response.data.description);
            setTitle(response.data.title);
            setImage(response.data.image);
            setImage1(response.data.image1);
            setImage2(response.data.image2);
            setImage3(response.data.image3);
            setSubTitle(response.data.package);
            
            // Calculate initial price
            const initialPrice = productPrice * count;
            setPrice(initialPrice);
            
            // Apply coupon if exists
            if(coupon)
            {
                getCoupon(productPrice)
            }
        })
        .catch((err)=>{
            console.error('Error fetching product:', err);
            // Fallback to mock product if API fails
            const mockProduct = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0];
            if (mockProduct) {
                const productPrice = parseInt(mockProduct.price_sell) || 0;
                setPriceSell(productPrice);
                setPriceId(mockProduct.price_id);
                setDescription(mockProduct.description);
                setTitle(mockProduct.title);
                setImage(mockProduct.image);
                setImage1(mockProduct.image1);
                setImage2(mockProduct.image2);
                setImage3(mockProduct.image3);
                setSubTitle(mockProduct.package);
                
                const initialPrice = productPrice * count;
                setPrice(initialPrice);
                
                if(coupon) {
                    getCoupon(productPrice);
                }
            }
        })
    }

    const getCoupon = (productPrice) =>{
        let data = JSON.stringify({
            'user':user,
            'coupon':coupon ? coupon : ""
        });
        let config = {
            method: 'post',
            url: `${baseurl}/api/coupon`,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
        axios(config)
        .then((response) => {
            const discountPercent = parseInt(response.data.percent) || 0;
            setPercent(discountPercent);
            
            // Calculate price with discount
            const pricePerItem = productPrice - (productPrice * discountPercent / 100);
            const totalPrice = pricePerItem * count;
            setPrice(totalPrice);
        })
        .catch((err)=>{
            console.error('Error fetching coupon:', err);
        })
    }

    return(
    
        <div className="wrap">
            <div className="detail-left pc">
                <div className="detail-main">
                    {image && <img src={image} alt=""/>}
                </div>
                <div className="detail-subimage">
                    <div className="detail-subimage-thumb">
                        {image1 && <img src={image1} alt=""/>}
                    </div>
                    <div className="detail-subimage-thumb">
                        {image2 && <img src={image2} alt=""/>}
                    </div>
                    <div className="detail-subimage-thumb">
                        {image3 && <img src={image3} alt=""/>}
                    </div>
                </div>
            </div>
            <div className="detail-right">
                <div className="detail-title">
                    {title}
                </div>
                <div className="detail-package">
                    {subtitile}
                </div>
                <p className="detail-text pc">
                    {description}
                </p>
                <div className="detail-count-sp">
                    <div className="detail-cost">
                        <div className="detail-count">
                            <p>{t('common.quantity')}</p>
                            <p>{count}</p>
                        </div>
                        <div className="detail-price">
                            <p>{t('product.specialPrice')}</p>
                            {percent !== 0 && price_sell && (
                                <p className="original">
                                    {parseInt(price_sell * count).toLocaleString('en-US')}{t('common.yen')} <span>{t('product.taxIncluded')}</span>
                                </p>
                            )}
                            {price_sell && (
                                <p>
                                    {parseInt((price_sell - (price_sell * percent / 100)) * count).toLocaleString('en-US')}{t('common.yen')} <span>{t('product.taxIncluded')}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    {/* <a href={`/order/${user}/${id}/${coupon}`} className="sp">今すぐ購入する</a> */}
                </div>
            </div>
            
        </div>
               
    )
}

export default Detail;