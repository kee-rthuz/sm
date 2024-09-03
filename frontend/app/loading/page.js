//   1


// import React from 'react';

// const LoadingPage = () => {
//   return (
//     <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-[#e2e2e2] to-[#68489e]">
//       <svg className="animate-spin h-32 w-32 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004.605 20h14.79A7.963 7.963 0 0020 17.291V12a8 8 0 00-8 8v-2.709z"></path>
//       </svg>
//       <h1 className="text-4xl font-bold text-white mt-4">Loading...</h1>
//     </div>
//   );
// };

// export default LoadingPage;





//    2


// import React from 'react';
// import Image from 'next/image';

// const LoadingPage = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-r from-[#e2e2e2] to-[#68489e]">
//       <div className="animate-rotateScale">
//           <Image src="/l.png" alt="logo" width={120} height={100} />
//       </div>
//     </div>
//   );
// };

// export default LoadingPage;



//   3

import React from 'react';
import Image from 'next/image'
import Bt from '../assets/l.png'

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#9A87BA]">
      <div className="animate-rotateScale">
        <Image src={Bt} alt="logo" width={120} height={100} />
      </div>
      <div className="flex mt-10 text-3xl">
        <p className="font-bold text-black mr-2 animate-slide-in-left">
          Mobi
        </p>
        <p className="font-bold text-gray-800 animate-slide-in-right">
          Dex
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
