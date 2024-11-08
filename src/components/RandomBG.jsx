import { useState, useEffect } from "react";

const RandomBG = () => {
  const [imageSrc, setImageSrc] = useState("");

  const imageList = ["https://pulausumbawanews.net/wp-content/uploads/2024/09/882024183313.jpg", "https://pulausumbawanews.net/wp-content/uploads/2024/09/882024183313.jpg"];

  useEffect(() => {
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
    setImageSrc(randomImage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {imageSrc ? (
          <img
          src={imageSrc}
          alt="best bid & quick quote"
          className="w-full lg:h-screen object-cover"
          />
      ) : null}
    </>
  );
};

export default RandomBG;
