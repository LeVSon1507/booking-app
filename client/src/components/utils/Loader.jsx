import { useState } from 'react';
import { css } from '@emotion/react';
import FadeLoader from 'react-spinners/FadeLoader';

const override = css`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20%;
  padding-left: 0;
`;

const Loader = () => {
  const [loading] = useState(true);

  return (
    <div className="sweet-loading text-center">
      <FadeLoader color="#333" loading={loading} css={override} size={40} />
    </div>
  );
};

export default Loader;
