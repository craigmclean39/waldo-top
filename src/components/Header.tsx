import Logo from '../images/logo.png';

import { useHistory } from 'react-router';

const Header = () => {
  const history = useHistory();

  const backToHome = () => {
    history.replace({
      pathname: '/',
    });
  };

  return (
    <div className='header'>
      <div className='innerHeader'>
        <div onClick={backToHome}>
          <div className='header__title-logo'>
            <img src={Logo} className='header__logo' alt=''></img>
            <h1 className='header__title title-blue'>WHERE'S</h1>
            <h1 className='header__title title-red'>WALDO</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Header };
