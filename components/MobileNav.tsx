'use client'

import Link from './Link'
import emitter from '@/components/Emitter'
import headerNavLinks from '@/data/headerNavLinks'
import { Dialog, Transition } from '@headlessui/react'
import { menuItemClass } from '@/components/FinanceConstants'
import { Fragment, useState, useEffect, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const navRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }
  /**
   *
   */
  const handleClicked = (item) => {
    onToggleNav()
    switch (item) {
      case 'IndicatorsInfo':
        emitter.emit('IndicatorsInfoMsg', { timestamp: Date.now() })
        console.log('MobileNav emit IndicatorsInfoMsg')
        break
      case 'StrategiesInfo':
        emitter.emit('StrategiesInfoMsg', { timestamp: Date.now() })
        break
      case 'DayRanges':
        emitter.emit('DayRangesMsg', { timestamp: Date.now() })
        break
      case 'SelectStrategies':
        emitter.emit('SelectStrategiesMsg', { timestamp: Date.now() })
        break
      case 'SelectIndicators':
        emitter.emit('SelectIndicatorsMsg', { timestamp: Date.now() })
        break
    }
  }
  /**
   *
   */
  useEffect(() => {
    return clearAllBodyScrollLocks
  })
  /**
   *
   */
  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-60 bg-black/25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-95"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-95"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <Dialog.Panel className="fixed left-0 top-0 z-70 h-full w-full bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
              <nav
                ref={navRef}
                className="mt-8 flex h-full basis-0 flex-col items-start overflow-y-auto pl-12 pt-2 text-left"
              >
                <div className="flex flex-col space-y-1">
                  <button className={menuItemClass} onClick={() => handleClicked('IndicatorsInfo')}>
                    Indicators Info
                  </button>
                  <button className={menuItemClass} onClick={() => handleClicked('StrategiesInfo')}>
                    Strategies Info
                  </button>
                  <button className={menuItemClass} onClick={() => handleClicked('DayRanges')}>
                    Day Ranges
                  </button>
                  <button
                    className={menuItemClass}
                    onClick={() => handleClicked('SelectIndicators')}
                  >
                    Select Indicators
                  </button>
                  <button
                    className={menuItemClass}
                    onClick={() => handleClicked('SelectStrategies')}
                  >
                    Select Strageties
                  </button>
                </div>
              </nav>
              <button
                className="fixed right-4 top-7 z-80 h-16 w-16 p-4 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                aria-label="Toggle Menu"
                onClick={onToggleNav}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
MobileNav.displayName = 'MobileNav'
export default MobileNav
