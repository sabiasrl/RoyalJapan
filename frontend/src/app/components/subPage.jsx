'use client'
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Sitemap from '@/app/components/Sitemap';
import { useI18n } from '@/app/i18n/I18nContext';
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
function SubPage({page}) {
    const { t } = useI18n();
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    useEffect(()=>{
        getPageData()
    },[])
    const getPageData = (id)=>{
        let config = {
            method: 'get',
            url: `${baseurl}/api/get-page-data`,
        };
        axios(config)
            .then(async (response) => {
                let tmp_data = {}
                console.log(response.data)
                response.data.settings.forEach(element => {

                    tmp_data = {...tmp_data, [element.key]:element.value}
                });
                if(page=="specified")
                {
                    setTitle(tmp_data["specified-title"])
                    setContent(tmp_data["specified-description"])
                }
                if(page=="personal"){
                    setTitle(tmp_data["protected-title"])
                    setContent(tmp_data["protected-description"])
                }
                if(page=="privacy"){
                    setTitle(tmp_data["privacy-title"])
                    setContent(tmp_data["privacy-title"])
                }
            })
            .catch((err)=>{
                console.log(err)

            })
    }

    return(
        <>
            <Header/>
            <div className="product">
                <section className="top">
                    <div className="top-img">
                        <Image
                          width={100}
                          height={100} src="/assets/images/top-img.png" alt=""/>
                        <Image
                          width={100}
                          height={100} src="/assets/images/top-img02.png" className="sp" alt=""/>
                    </div>
                    <img src="/assets/images/logo.svg" className="top-logo-img" alt=""/>
                    <p className="top-text1">{t('productDetail.royalJapan')}<br/>{t('productDetail.officialOnline')}</p>
                    <p className="top-text2">{t('productDetail.tagline1')}</p>
                    <p className="top-text3">{t('productDetail.tagline2')}</p>
                </section>

                <section className="list">
                    <div className="sub-page-title">
                        {title}
                    </div>
                    <div className="contain">

                        <div style={{display:"flex"}}>
                            <p>{content}</p>
                        </div>

                    </div>
                </section>
            </div>
            <Sitemap/>

        </>
    )
}
export default SubPage;