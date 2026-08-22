import {
  IoCall,
  IoGlobeOutline,
  IoLocation,
  IoLogoBehance,
  IoLogoBitbucket,
  IoLogoCodepen,
  IoLogoDiscord,
  IoLogoDribbble,
  IoLogoFacebook,
  IoLogoFoursquare,
  IoLogoGithub,
  IoLogoGitlab,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoMedium,
  IoLogoPinterest,
  IoLogoReddit,
  IoLogoRss,
  IoLogoSkype,
  IoLogoSlack,
  IoLogoSnapchat,
  IoLogoSoundcloud,
  IoLogoTiktok,
  IoLogoTumblr,
  IoLogoTwitter,
  IoLogoVimeo,
  IoLogoVk,
  IoLogoWhatsapp,
  IoLogoYoutube,
  IoMail,
} from "react-icons/io5";

/**
 * Renders only the networks that carry a value in config/social.json, so an
 * unused network never produces an empty link.
 *
 * Every href here must be absolute. `address` in particular used to be a bare
 * postal address, which the browser resolved relative to the current page and
 * turned into a 404 (kareplusrugby.co.uk/6a Davy Court,...). It is now a full
 * Google Maps URL.
 */
/**
 * Every icon link is given an explicit 44x44 hit area (h-11 w-11). The icons
 * themselves render at around 18px, so before this the tap target was roughly
 * a third of the 44x44 minimum - fiddly for anyone, and genuinely hard for
 * someone with a tremor or reduced dexterity.
 */
const ICON_LINK =
  "inline-flex h-11 w-11 items-center justify-center rounded-full " +
  "transition-colors hover:bg-white/10 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-primary-950";

const Social = ({ source, className }) => {
  const {
    facebook,
    twitter,
    instagram,
    youtube,
    linkedin,
    github,
    gitlab,
    discord,
    slack,
    medium,
    codepen,
    bitbucket,
    dribbble,
    behance,
    pinterest,
    soundcloud,
    tumblr,
    reddit,
    vk,
    whatsapp,
    snapchat,
    vimeo,
    tiktok,
    foursquare,
    rss,
    email,
    phone,
    address,
    skype,
    website,
  } = source;
  return (
    <ul className={className}>
      {facebook && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="Kare Plus Rugby on Facebook (opens in a new tab)"
            href={facebook}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoFacebook />
          </a>
        </li>
      )}
      {twitter && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="twitter"
            href={twitter}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoTwitter />
          </a>
        </li>
      )}
      {instagram && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="Kare Plus Rugby on Instagram (opens in a new tab)"
            href={instagram}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoInstagram />
          </a>
        </li>
      )}
      {youtube && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="youtube"
            href={youtube}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoYoutube />
          </a>
        </li>
      )}
      {linkedin && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="Kare Plus Rugby on LinkedIn (opens in a new tab)"
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoLinkedin />
          </a>
        </li>
      )}
      {github && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="github"
            href={github}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoGithub />
          </a>
        </li>
      )}
      {gitlab && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="gitlab"
            href={gitlab}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoGitlab />
          </a>
        </li>
      )}
      {discord && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="discord"
            href={discord}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoDiscord />
          </a>
        </li>
      )}
      {slack && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="slack"
            href={slack}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSlack />
          </a>
        </li>
      )}
      {medium && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="medium"
            href={medium}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoMedium />
          </a>
        </li>
      )}
      {codepen && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="codepen"
            href={codepen}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoCodepen />
          </a>
        </li>
      )}
      {bitbucket && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="bitbucket"
            href={bitbucket}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoBitbucket />
          </a>
        </li>
      )}
      {dribbble && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="dribbble"
            href={dribbble}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoDribbble />
          </a>
        </li>
      )}
      {behance && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="behance"
            href={behance}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoBehance />
          </a>
        </li>
      )}
      {pinterest && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="pinterest"
            href={pinterest}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoPinterest />
          </a>
        </li>
      )}
      {soundcloud && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="soundcloud"
            href={soundcloud}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSoundcloud />
          </a>
        </li>
      )}
      {tumblr && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="tumblr"
            href={tumblr}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoTumblr />
          </a>
        </li>
      )}
      {reddit && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="reddit"
            href={reddit}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoReddit />
          </a>
        </li>
      )}
      {vk && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="vk"
            href={vk}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoVk />
          </a>
        </li>
      )}
      {whatsapp && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="Message Kare Plus Rugby on WhatsApp (opens in a new tab)"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoWhatsapp />
          </a>
        </li>
      )}
      {snapchat && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="snapchat"
            href={snapchat}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSnapchat />
          </a>
        </li>
      )}
      {vimeo && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="vimeo"
            href={vimeo}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoVimeo />
          </a>
        </li>
      )}
      {tiktok && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="tiktok"
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoTiktok />
          </a>
        </li>
      )}
      {foursquare && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="foursquare"
            href={foursquare}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoFoursquare />
          </a>
        </li>
      )}
      {skype && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="skype"
            href={skype}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSkype />
          </a>
        </li>
      )}
      {website && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="website"
            href={website}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoGlobeOutline />
          </a>
        </li>
      )}
      {rss && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="rss feed"
            href={rss}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoRss />
          </a>
        </li>
      )}
      {email && (
        <li className="inline-block">
          <a className={ICON_LINK} aria-label="Email Kare Plus Rugby" href={`mailto:${email}`}>
            <IoMail />
          </a>
        </li>
      )}
      {phone && (
        <li className="inline-block">
          {/* Strip spaces: config holds the number in readable form ("01788 422422")
              and a space in a tel: URI is not valid. Same number, no reformatting. */}
          <a
            className={ICON_LINK}
            aria-label="Call Kare Plus Rugby"
            href={`tel:${String(phone).replace(/\s+/g, "")}`}
          >
            <IoCall />
          </a>
        </li>
      )}
      {address && (
        <li className="inline-block">
          <a
            className={ICON_LINK}
            aria-label="Find our office on Google Maps (opens in a new tab)"
            href={address}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLocation />
          </a>
        </li>
      )}
    </ul>
  );
};

export default Social;
