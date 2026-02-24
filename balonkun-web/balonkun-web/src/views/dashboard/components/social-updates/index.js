import React from "react";
import { Container } from "reactstrap";
import Masonry from '@mui/lab/Masonry';
import { img1, img2, img3, img4, img5, img6, img7, img8, img9 } from "@assets/images";

const data = [
  {
    href: "https://www.instagram.com/reel/C2aj5lRhYLZ/?igsh=b2F3c2gyY25reWZ0",
    url: img1,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C4iSJJUB8lE/?igsh=MXFyZDdxdm5hMmZuZg==",
    url: img2,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C7lTVtANev-/?igsh=cGY0czg3d29udXk3",
    url: img3,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C4P0D25rmbn/?igsh=bjFocWpwNjlrNzA1",
    url: img4,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C2XF091L-M3/?igsh=MnhpdWdtbTBkcmUx",
    url: img5,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C3DDo6DBftO/?igsh=d3o1dDkwbTJ4N3Fz",
    url: img6,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C6x_XLSNRBM/?igsh=dGQ1dnVjMnE3ajM4",
    url: img7,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C5N_zyQhmtD/?igsh=MWNraHR3eG5weGx6bg==",
    url: img8,
    alt: "how it works"
  },
  {
    href: "https://www.instagram.com/reel/C8CeEThBso4/?igsh=MTFrNmZzdW1yeXJ0aw==",
    url: img9,
    alt: "how it works"
  }
]

const SocialUpdates = ({
  title
}) => {
  return (
    <section>
      <h2 className="heading">
        {title}
      </h2>

      <Container className="social-updates-wrapper">
        <Masonry columns={{ xs: 3, md: 4 }} spacing={0} defaultSpacing={0} defaultColumns={3} defaultHeight={500}>
          {data.map((item, index) => (
            <a key={index} href={item.href} target="_blank" rel="noreferrer">
              <img src={item.url} alt={item.alt} loading="lazy" />
            </a>
          ))}
        </Masonry>
      </Container>
    </section>
  );
};

export default SocialUpdates;