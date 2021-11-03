import Logo from '../images/logo.png';

import { useHistory } from 'react-router';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ hasTimer, timerValue }) => {
  const history = useHistory();

  const backToHome = () => {
    history.replace({
      pathname: '/',
    });
  };

  return (
    <>
      <div className='header'>
        <div className='innerHeader'>
          <div onClick={backToHome}>
            <div className='header__title-logo'>
              <img src={Logo} className='header__logo' alt=''></img>
              <div className='header__title-flex'>
                <h1 className='header__title title-blue'>WHERE'S</h1>
                <h1 className='header__title title-red'>WALDO</h1>
              </div>
            </div>
          </div>
          {hasTimer ? <div className='timer'>{timerValue}</div> : null}
        </div>
      </div>
      <div className='invisible-header'></div>
    </>
  );
};

export { Header };
