import { Helmet } from "react-helmet";

const HelmetTitle = ({ title }) => {
  return (
    <>
      <div className="application">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{title}</title>
          <link rel="canonical" href="http://mysite.com/example" />
          <link
            rel="shortcut icon"
            href="https://static-00.iconduck.com/assets.00/messenger-icon-512x512-5pi1qivq.png"
            type="image/x-icon"
          />
        </Helmet>
      </div>
    </>
  );
};

export default HelmetTitle;
