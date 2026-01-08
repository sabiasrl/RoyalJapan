"use client";
// import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import Image from "next/image";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sitemap from "@/app/components/Sitemap";
// import Detail from '../components/Detail';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useI18n } from "@/app/i18n/I18nContext";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

function ProductDetail({ params }) {
  // const navigate = useNavigate()
  const router = useRouter();
  const { t } = useI18n();
  const { addToCart } = useCart();
  const { user_id, product_id } = params;
  const [coupon, setCoupon] = useState("");
  const [price_sell, setPrice] = useState("");
  const [price_id, setPriceId] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [percent, setPercent] = useState(0);
  const [subtitile, setSubTitle] = useState("");
  const [count, setCount] = useState(10);
  const [addedToCart, setAddedToCart] = useState(false);
  useEffect(() => {
    getProductData();
  }, []);
  const getProductData = () => {
    let config = {
      method: "get",
      url: `${baseurl}/api/product/${product_id}`,
    };
    axios(config)
      .then(async (response) => {
        setPrice(response.data.price_sell);
        setPriceId(response.data.price_id);
        setDescription(response.data.description);
        setTitle(response.data.title);
        setImage(response.data.image);
        setImage1(response.data.image1);
        setImage2(response.data.image2);
        setImage3(response.data.image3);
        setSubTitle(response.data.package);
      })
      .catch((err) => {});
  };

  const handleSubmit = () => {
    if (count < 10) {
      setCount(10);
      router.push(`/order/${user_id}/${product_id}/${coupon}?count=10`);
    } else {
      router.push(`/order/${user_id}/${product_id}/${coupon}?count=${count}`);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      product_id: parseInt(product_id),
      user_id,
      quantity: parseInt(count),
      coupon: coupon || '',
      price_sell: parseInt(price_sell),
      title,
      image,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <Header />
      <div className="product">
        <section className="top pc">
          <div className="top-img">
            <Image
              width={100}
              height={100} src="/assets/images/top-img.png" alt="" />
            <Image
              width={100}
              height={100} src="/assets/images/top-img02.png" className="sp" alt="" />
          </div>
          <img src="/assets/images/logo.svg" alt="" />
          <p className="top-text1">
            {t('productDetail.royalJapan')}
            <br />
            {t('productDetail.officialOnline')}
          </p>
          <p className="top-text2">{t('productDetail.tagline1')}</p>
          <p className="top-text3">{t('productDetail.tagline2')}</p>
        </section>
        <section className="detail">
          <div className="contain">
            <div className="wrap">
              <div className="detail-left">
                <div className="detail-main">
                  {image && <img src={image} alt="" />}
                </div>
                <div className="detail-subimage">
                  <div className="detail-subimage-thumb">
                    {image1 && <img src={image1} alt="" />}
                  </div>
                  <div className="detail-subimage-thumb">
                    {image2 && <img src={image2} alt="" />}
                  </div>
                  <div className="detail-subimage-thumb">
                    {image3 && <img src={image3} alt="" />}
                  </div>
                </div>
              </div>
              <div className="detail-right">
                <div className="detail-title">{title}</div>
                <div className="detail-package">{subtitile}</div>
                <p className="detail-text pc">{description}</p>
                <div className="detail-count-sp">
                  <div className="detail-cost">
                    <div className="detail-count">
                      <div style={{ color: "#8F121A", fontSize: "20px" }}>
                        {t('common.quantity')}{" "}
                        <span
                          style={{
                            color: "red",
                            fontSize: "16px",
                            marginLeft: "10px",
                          }}
                        >
                          {t('product.minimumQuantity')}
                        </span>
                      </div>
                      <div className="count-input">
                        <select
                          value={count}
                          onChange={(e) => {
                            setCount(e.target.value);
                          }}
                        >
                          <option value={10}> 10 </option>
                          <option value={15}> 15 </option>
                          <option value={20}> 20 </option>
                          <option value={25}> 25 </option>
                          <option value={30}> 30 </option>
                        </select>
                      </div>
                    </div>
                    <div className="detail-price">
                      <p>{t('product.specialPrice')}</p>
                      {percent !== 0 && (
                        <p className="original">
                          {parseInt(price_sell * count)
                            .toLocaleString("en-US")
                            .toString()}
                          {t('common.yen')} <span>{t('product.taxIncluded')}</span>
                        </p>
                      )}
                      <p>
                        {(
                          parseInt(price_sell - (price_sell * percent) / 100) *
                          count
                        )
                          .toLocaleString("en-US")
                          .toString()}
                        {t('common.yen')} <span>{t('product.taxIncluded')}</span>
                      </p>
                    </div>
                  </div>
                  <a onClick={handleSubmit} className="sp">
                    {t('product.buyNow')}
                  </a>
                </div>
              </div>
            </div>
            <div className="form-input">
              <div className="label">{t('product.couponCode')}</div>
              <div className="input">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  type="text"
                  name="address"
                  placeholder={t('product.couponPlaceholder')}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <a onClick={handleSubmit} className="site-link pc" style={{ flex: 1 }}>
                <p>{t('common.purchase')}</p>
                <span></span>
              </a>
              <a
                onClick={handleAddToCart}
                className="site-link pc"
                style={{
                  flex: 1,
                  background: addedToCart ? '#4CAF50' : '#8F121A',
                  cursor: 'pointer',
                }}
              >
                <p>{addedToCart ? t('cart.addedToCart') : t('cart.addToCart')}</p>
                <span></span>
              </a>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <a onClick={handleSubmit} className="sp" style={{ flex: 1, textAlign: 'center', padding: '15px', background: '#8F121A', color: 'white', borderRadius: '4px' }}>
                {t('product.buyNow')}
              </a>
              <a
                onClick={handleAddToCart}
                className="sp"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '15px',
                  background: addedToCart ? '#4CAF50' : '#8F121A',
                  color: 'white',
                  borderRadius: '4px',
                }}
              >
                {addedToCart ? t('cart.addedToCart') : t('cart.addToCart')}
              </a>
            </div>
            <p className="detail-text sp">{description}</p>
          </div>
        </section>
      </div>
      <Footer />
      <Sitemap />
    </>
  );
}
export default ProductDetail;
