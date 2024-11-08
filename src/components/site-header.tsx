import Link from 'next/link'
import { Icons } from '~/components/icons'
import { MainNav } from '~/components/main-nav'
import { MobileNav } from '~/components/mobile-nav'
import { ModeToggle } from '~/components/mode-toggle'
import { buttonVariants } from '~/components/ui/button'
import { siteConfig } from '~/config/site'
import { cn } from '~/lib/utils'
import UserDropdownMenu from '~/components/user-dropdown-menu'
import { auth } from '~/server/auth'

type SiteHeaderProps = {
  params: Promise<{ slug: string }>
}

export async function SiteHeader({ params }: SiteHeaderProps) {
  const paramsStore = await params
  const session = await auth()
  let stars = 300 // Default value

  try {
    const response = await fetch('https://api.github.com/repos/magicuidesign/magicui', {
      headers: process.env.GITHUB_OAUTH_TOKEN
        ? {
            Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
            'Content-Type': 'application/json',
          }
        : {},
      next: {
        revalidate: 3600,
      },
    })

    if (response.ok) {
      const data = await response.json()
      stars = data.stargazers_count || stars // Update stars if API response is valid
    }
  } catch (error) {
    console.error('Error fetching GitHub stars:', error)
  }

  return (
    <header
      className={cn(
        'supports-backdrop-blur:bg-background/90 sticky top-0 z-40 w-full bg-background/40 backdrop-blur-lg',
      )}
    >
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav slug={paramsStore?.slug} />
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          {/*<Link*/}
          {/*  className={cn(*/}
          {/*    buttonVariants({*/}
          {/*      variant: 'rainbow',*/}
          {/*    }),*/}
          {/*    'hidden md:inline-flex',*/}
          {/*  )}*/}
          {/*  target="_blank"*/}
          {/*  href={siteConfig.links.github}*/}
          {/*>*/}
          {/*  <div className="flex items-center">*/}
          {/*    <Icons.gitHub className="size-4" />*/}
          {/*    <span className="ml-1 lg:hidden">Star</span>*/}
          {/*    <span className="ml-1 hidden lg:inline">Star on GitHub</span>{' '}*/}
          {/*  </div>*/}
          {/*</Link>*/}

          <div className="w-full flex-1 md:w-auto md:flex-none">{/*<CommandMenu />*/}</div>
          <nav className="flex items-center gap-1">
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0',
                )}
              >
                <Icons.gitHub className="size-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0',
                )}
              >
                <Icons.twitter className="size-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
            <UserDropdownMenu />
          </nav>
        </div>
      </div>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-200/30 to-neutral-200/0" />
    </header>
  )
}