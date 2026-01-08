"use client";
import Image from "next/image";
import styles from "./page.module.css";

// import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sitemap from "@/app/components/Sitemap";
import { useParams } from "next/navigation";
import { useI18n } from "@/app/i18n/I18nContext";
// const baseurl = import.meta.env.REACT_APP_API_BASE_URL;
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

function TopPage() {
  const { id } = useParams();
  const { t } = useI18n();

  useEffect(() => {
    localStorage.setItem("userID", id);
  }, [id]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getUserData(id);
  }, []);

  const getUserData = (id) => {
    let config = {
      method: "get",
      url: `${baseurl}/api/user-products/${id}`,
    };
    axios(config)
      .then(async (response) => {
        setProducts(response.data.products);
      })
      .catch((err) => {});
  };

  return (
    <>
      <Header />
      <div className="product">
        <section className="top">
          <div className="top-img">
            <Image
              width={100}
              height={100}
              src="/assets/images/top-img.png"
              alt=""
            />
            <Image
              width={100}
              height={100}
              src="/assets/images/top-img02.png"
              className="sp"
              alt=""
            />
          </div>
          <img src="/assets/images/logo.svg" className="top-logo-img" alt="" />
          <p className="top-text1">
            {t('productDetail.royalJapan')}
            <br />
            {t('productDetail.officialOnline')}
          </p>
          <p className="top-text2">{t('productDetail.tagline1')}</p>
          <p className="top-text3">{t('productDetail.tagline2')}</p>
        </section>
        <section className="site">
          <div className="contain">
            <div className="wrap">
              <div className="site-part">
                <div className="site-part-thumb">
                  <Image
                    width={300}
                    height={300}
                    src="/assets/images/site01.png"
                    alt=""
                  />
                </div>
                <h3 className="site-part-title">
                  {t('productListing.natureGift')} <br />
                  {t('productListing.naturalIngredients')}
                </h3>
              </div>
              <div className="site-part">
                <div className="site-part-thumb">
                  <Image
                    width={300}
                    height={300}
                    src="/assets/images/site02.png"
                    alt=""
                  />
                </div>
                <h3 className="site-part-title">
                  {t('productListing.manufacturing')}
                </h3>
              </div>
              <div className="site-part">
                <div className="site-part-thumb">
                  <Image
                    width={300}
                    height={300}
                    src="/assets/images/site03.png"
                    alt=""
                  />
                </div>
                <h3 className="site-part-title">
                  {t('productListing.naturalAphrodisiac')}
                </h3>
              </div>
            </div>
            <a href="" className="site-link">
              <p>{t('productListing.aboutSite')}</p>
              <span></span>
            </a>
          </div>
        </section>
        <section className="list">
          <div className="list-title">{t('product.title')}</div>
          <div className="contain">
            {products.map((item, index) => (
              <div className="list-item" key={index}>
                <div className="list-item-thumb">
                  <Image width={300} height={300} src={item.image} alt="" />
                </div>
                <h3 className="list-item-title">{item.title}</h3>
                <div className="list-item-package">{item.package}</div>
                <p className="list-item-content">{item.description}</p>
                <div className="list-item-price">
                  <div className="wrap">
                    <div className="list-item-price-title">{t('product.specialPrice')}</div>
                    <p>
                      {parseInt(item.price_sell)
                        .toLocaleString("en-US")
                        .toString()}{" "}
                      <span>{t('product.taxIncluded')}</span>
                    </p>
                  </div>
                  <a href={`/products/${id}/${item.id}`}>{t('product.buyNow')}</a>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="social">
          <div className="contain">
            <div className="social-part">
              <div className="social-left">
                <div className="social-title">
                  <p>Twitter</p>
                  <p>
                    <img src="/assets/images/icon-instagram.png" alt="" />
                    <span>Instagram</span>
                  </p>
                </div>
                <div className="social-left-title">
                  {t('productListing.followPost')}
                  <br />
                  {t('productListing.giftCampaign')}
                </div>
              </div>
              <div className="social-right">
                <img src="/assets/images/twitter-thumb.png" alt="" />
                <p>{t('productListing.giftAmount')}</p>
              </div>
            </div>
            <div className="social-part">
              <div className="social-top">
                <div className="social-title">
                  <p>
                    <span>LINE</span><br/>{t('productListing.lineFriend')}
                  </p>
                </div>
                <div className="social-top-title">
                  <p>{t('productListing.lineCoupon')}</p>
                  <div className="social-top-perc">
                    {t('productListing.lineCouponAmount')}
                    <br />
                    {t('productListing.lineCouponNow')}
                  </div>
                </div>
                <a href="" className="line-btn">
                  <img src="/assets/images/line.png" alt="" />
                  <p>{t('productListing.lineAddFriend')}</p>
                </a>
              </div>
              <div className="social-bottom">
                <p>{t('productListing.lineLatestInfo')}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="others">
          <div className="contain">
            <div className="others-item">
              <div className="others-item-left">
                <img src="/assets/images/people-line-solid.svg" alt="" />
              </div>
              <div className="others-item-right">
                <h3 className="others-item-title">{t('productListing.handling')}</h3>
                <p>
                  {t('productListing.handlingDescription')}
                </p>
              </div>
            </div>
            <div className="others-item">
              <div className="others-item-left">
                <img src="/assets/images/cart-arrow-down-solid.svg" alt="" />
              </div>
              <div className="others-item-right">
                <h3 className="others-item-title">{t('productListing.subscription')}</h3>
                <p>
                  {t('productListing.subscriptionDescription')}
                </p>
              </div>
            </div>
            <div className="others-item">
              <div className="others-item-left">
                <img src="/assets/images/headset-solid.svg" alt="" />
              </div>
              <div className="others-item-right">
                <h3 className="others-item-title">{t('productListing.support')}</h3>
                <p>
                  {t('productListing.supportDescription')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <Sitemap />
    </>
  );
}
export default TopPage;
// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol>
//           <li>
//             Get started by editing <code>src/app/page.js</code>.
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>
//
//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.secondary}
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className={styles.footer}>
//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
