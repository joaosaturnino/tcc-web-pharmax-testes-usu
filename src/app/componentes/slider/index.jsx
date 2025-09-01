"use client";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import style from "./index.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Slider({ imagens }) {
  return (
    <Carousel showThumbs={false} infiniteLoop autoPlay>
      {imagens.map((src, idx) => (
        <div key={idx} className={style.slideContainer}>
          <Image
            src={src}
            alt={`Promoção ${idx + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={idx === 0}
          />
        </div>
      ))}
    </Carousel>
  );
}
