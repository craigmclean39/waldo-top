import Logo from '../images/logo.png';

import { useHistory } from 'react-router';
import { HeaderProps } from '../types';
import { useCallback, useEffect, useRef, useState } from 'react';

const Header: React.FC<HeaderProps> = ({ hasTimer, stopTimer }) => {
  const history = useHistory();
  const intervalRef = useRef<any>();
  const [time, setTime] = useState('');
  const prevTimerValue = useRef(0);

  const timerFunc = useCallback(() => {
    if (!stopTimer) {
      prevTimerValue.current = prevTimerValue.current + 100;
    }

    setTime((prevTimerValue.current / 1000).toFixed(2));
  }, [stopTimer]);

  useEffect(() => {
    if (hasTimer) {
      intervalRef.current = setInterval(timerFunc, 100);
    }

    return () => {
      if (hasTimer) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasTimer, stopTimer, timerFunc]);

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
          {hasTimer ? <div className='timer'>{time}</div> : null}
        </div>
      </div>
      <div className='invisible-header'></div>
    </>
  );
};

export { Header };
