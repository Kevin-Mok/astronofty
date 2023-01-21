import { Link, useLocation } from 'react-router-dom';

import './Header.css';

const HeaderLink = ({ page, selected }) => {
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  let className = selected ? 'headerlink-no-link ' : '';
  className += 'headerlink-title';

  return (
    <Link to={`/${page}`} className={className}>
      {title}
      <div className={selected ? 'headerlink-dot-active' : 'headerlink-dot'}>
        •
      </div>
    </Link>
  );
};
  // console.log(page, selected)

const Header = () => {
  console.log(useLocation())
  // const page = useParams().page || 'home';
  const page = useLocation().pathname.slice(1) || 'home';

  return (
    <div className='header'>
      <HeaderLink page='home' selected={page === 'home'} />
      <HeaderLink page='upload' selected={page === 'upload'} />
      <HeaderLink page='multUpload' selected={page === 'multUpload'} />
    </div>
  );
};

export default Header;

