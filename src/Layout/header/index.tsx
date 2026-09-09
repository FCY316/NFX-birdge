

import logo from '@/image/logo.png';

import Connect from './component/Connect';
import Language from './component/Language';

// Header 组件定义
const Header = () => {

  return (
    <div className='glass-header sticky top-0 z-50 box-border flex justify-between items-center px-3 sm:px-5 py-2 sm:py-3 mb-4 sm:mb-5'>
      <div className='flex items-center z-50 gap-1.5 sm:gap-2'>
        <img
          src={logo}
          className='w-7 h-7 sm:w-9 sm:h-9 cursor-pointer transition-transform hover:scale-110 hover:rotate-12 duration-300'
          alt='logo'
        />
        <span className='gradient-text text-sm sm:text-lg font-bold whitespace-nowrap tracking-tight'>NFX BRIDGE</span>
      </div>
      <div className='flex items-center z-50 gap-1.5 sm:gap-3'>
        <Language />
        <Connect />
      </div>
    </div>
  )
}

export default Header