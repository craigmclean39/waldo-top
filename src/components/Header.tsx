import Logo from '../images/logo.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='header'>
      <div className='innerHeader'>
        <Link className='link' to='/'>
          <div className='header__title-logo'>
            <img src={Logo} className='header__logo' alt=''></img>
            <h1 className='header__title title-blue'>WHERE'S</h1>
            <h1 className='header__title title-red'>WALDO</h1>
          </div>
        </Link>
      </div>
    </div>
  );
};

export { Header };
