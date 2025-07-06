import React from 'react';
import Lottie from 'lottie-react';
import './Preloader.css';

function Preloader() {
  // Load the new animation from the public folder
  // Fetch the JSON file dynamically since it's in public
  const [animationData, setAnimationData] = React.useState(null);

  React.useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/animation-preloader.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="preloader-overlay">
      <div className="preloader-lottie">
        {/* Only render Lottie if animationData is loaded */}
        {animationData && <Lottie animationData={animationData} loop={true} />}
      </div>
    </div>
  );
}

export default Preloader; 