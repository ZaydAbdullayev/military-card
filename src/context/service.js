import { ranks } from "./datas";
import html2canvas from "html2canvas";

export const generateRandomID = () => {
    return "MIL-" + Math.floor(100000 + Math.random() * 900000); // MIL-843271
};

export const getRandomRank = () => {
    const randomIndex = Math.floor(Math.random() * ranks.length);
    return ranks[randomIndex];
};

export const getRandomRozetClass = () => {
    const index = Math.floor(Math.random() * 9) + 1;
    return `r${index}`;
};

export const formatMilitaryDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth(); // 0-indexed
    const year = date.getFullYear();

    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
        "İyul", "Avqust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    return `${year} ${months[month]} ${day}`;
};


export const saveCardAsImage = async (cardElement) => {

    if (!cardElement) {
        console.error("🎯 .military-card-container bulunamadı!");
        return;
    }

    try {
        const canvas = await html2canvas(cardElement, {
            backgroundColor: null, // şeffaf arka plan için
            scale: 2, // daha kaliteli görüntü
            useCORS: true // harici img'ler için (örn. logo vs)
        });

        const dataURL = canvas.toDataURL("image/png");

        // Galeriye kaydedilsin: kullanıcıya indirme ver
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "military_card.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("💥 Kart görsele çevrilemedi:", error);
    }
};
