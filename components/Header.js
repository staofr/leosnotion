import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'
import useTheme from '@/lib/theme'

const NavBar = () => {
  const BLOG = useConfig()
  const locale = useLocale()
  const links = [
    { id: 0, name: locale.NAV.INDEX, to: BLOG.path || '/', show: false },
    { id: 1, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: false, external: false },
    { id: 3, name: locale.NAV.SEARCH, to: '/search', show: false }
  ]
  return (
    <div className="flex-shrink-0">
      <ul className="flex flex-row">
        {links.map(
          link =>
            link.show && (
              <li
                key={link.id}
                className="block ml-4 text-black dark:text-gray-50 nav"
              >
                <Link href={link.to} target={link.external ? '_blank' : null}>{link.name}</Link>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

export default function Header ({ navBarTitle, fullWidth }) {
  const BLOG = useConfig()
  const { dark } = useTheme()

  // Favicon


  const [favicon, _setFavicon] = useState(resolveFavicon())
  const setFavicon = fallback => _setFavicon(resolveFavicon(fallback))

  useEffect(
    () => setFavicon(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dark]
  )

  const useSticky = !BLOG.autoCollapsedNavBar
  const navRef = useRef(/** @type {HTMLDivElement} */ undefined)
  const sentinelRef = useRef(/** @type {HTMLDivElement} */ undefined)
  const handler = useCallback(([entry]) => {
    if (useSticky && navRef.current) {
      navRef.current?.classList.toggle('sticky-nav-full', !entry.isIntersecting)
    } else {
      navRef.current?.classList.add('remove-sticky')
    }
  }, [useSticky])

  useEffect(() => {
    const sentinelEl = sentinelRef.current
    const observer = new window.IntersectionObserver(handler)
    observer.observe(sentinelEl)

    return () => {
      sentinelEl && observer.unobserve(sentinelEl)
    }
  }, [handler, sentinelRef])

  const titleRef = useRef(/** @type {HTMLParagraphElement} */ undefined)

  function handleClickHeader (/** @type {MouseEvent} */ ev) {
    if (![navRef.current, titleRef.current].includes(ev.target)) return

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <div className="observer-element h-4 md:h-12" ref={sentinelRef}></div>
      <div
        className={`sticky-nav group m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60 ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        }`}
        id="sticky-nav"
        ref={navRef}
        onClick={handleClickHeader}
      >
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="79.000000pt" height="20.000000pt" viewBox="0 0 79.000000 20.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,20.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M415 192 c-68 -23 -92 -79 -60 -142 17 -32 72 -55 107 -45 43 13 68
46 68 87 0 52 -15 77 -55 94 -19 8 -36 14 -37 13 -2 -1 -12 -4 -23 -7z m59
-58 c22 -21 20 -50 -4 -74 -24 -24 -29 -24 -58 -4 -24 17 -30 62 -10 82 17 17
54 15 72 -4z"/>
<path d="M671 184 c-25 -10 -31 -19 -31 -42 0 -34 11 -45 63 -61 20 -7 37 -17
37 -22 0 -17 -30 -22 -57 -10 -21 10 -29 9 -41 -3 -13 -12 -11 -16 9 -26 40
-22 99 -18 120 9 10 13 19 29 19 36 0 21 -29 45 -61 52 -36 7 -56 28 -34 37 8
3 26 1 39 -4 18 -6 28 -5 37 6 15 18 9 24 -34 34 -22 5 -45 3 -66 -6z"/>
<path d="M0 100 l0 -90 70 0 c63 0 70 2 70 20 0 17 -7 20 -45 20 l-45 0 0 70
c0 68 -1 70 -25 70 -25 0 -25 -1 -25 -90z"/>
<path d="M170 100 l0 -90 70 0 c63 0 70 2 70 20 0 17 -7 20 -50 20 -38 0 -50
4 -50 15 0 11 12 15 45 15 38 0 45 3 45 20 0 17 -7 20 -45 20 -33 0 -45 4 -45
15 0 11 12 15 50 15 43 0 50 3 50 20 0 18 -7 20 -70 20 l-70 0 0 -90z"/>
<path d="M560 30 c0 -15 7 -20 25 -20 18 0 25 5 25 20 0 15 -7 20 -25 20 -18
0 -25 -5 -25 -20z"/>
</g>
</svg>
        <div className="flex items-center">
          <Link href="/" aria-label={BLOG.title}>
            <Image
              src={favicon}
              width={24}
              height={24}
              alt={BLOG.title}
              onError={() => setFavicon(true)}
            />
          </Link>
          <HeaderName
            ref={titleRef}
            siteTitle={BLOG.title}
            siteDescription={BLOG.description}
            postTitle={navBarTitle}
            onClick={handleClickHeader}
          />
        </div>
        <NavBar />
      </div>
    </>
  )
}

const HeaderName = forwardRef(function HeaderName ({ siteTitle, siteDescription, postTitle, onClick }, ref) {
  return (
    <p
      ref={ref}
      className="header-name ml-2 font-medium text-gray-600 dark:text-gray-300 capture-pointer-events grid-rows-1 grid-cols-1 items-center"
      onClick={onClick}
    >
      {postTitle && <span className="post-title row-start-1 col-start-1">{postTitle}</span>}
      <span className="row-start-1 col-start-1">
        <span className="site-title">{siteTitle}</span>
        <span className="site-description font-normal">, {siteDescription}</span>
      </span>
    </p>
  )
})
