'use client'

import * as d3 from 'd3'
import DOMPurify from 'dompurify'
import emitter from '@/components/Emitter'
import { Dialog, Transition } from '@headlessui/react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Fragment, useState, useEffect, useRef, useLayoutEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import {
  ItemProps,
  ItemsProps,
  StrategiesItems,
  IndicatorsItems,
  QuotesItems,
  menuItemsClsQuotes,
  menuItemsClsIndicators,
  menuItemsClsStrategies,
  menuItemClass,
  menuItemClassHighlight,
  menuButtonCls,
} from '@/components/FinanceConstants'
/**
 *
 */
function SlideQuote() {
  const [navShow, setNavShow] = useState(false)
  const [buttonSelected, setButtonSelected] = useState('1 D')
  const navRef = useRef(null)
  /**
   *
   */
  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        if (navRef.current) enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        if (navRef.current) disableBodyScroll(navRef.current)
      }
      return !status
    })
  }
  /**
   *
   */
  const handleClicked = (item) => {
    onToggleNav()
    setButtonSelected(item.name)
    emitter.emit('SlideMenuMsg', { menu: 'Quotes', item: item, timestamp: Date.now() })
  }
  /**
   * await main menu select
   */
  emitter.on('DayRangesMsg', (data) => {
    setTimeout(() => {
      setNavShow(true)
    }, 100)
  })
  /**
   *
   */
  useEffect(() => {
    console.log('SlideQuote: useEffect', navRef.current)
    return clearAllBodyScrollLocks
  })
  /**
   *
   */
  return (
    <>
      <span id="SlideQuotes" className="md:hidden">
        <button className={menuButtonCls} aria-label="Toggle Menu" onClick={onToggleNav}>
          Quotes
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
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
              enter="transition ease-in duration-300 transform"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-1/2 opacity-95"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-1/2 opacity-95"
              leaveTo="translate-x-full opacity-0"
              unmount={false}
            >
              <Dialog.Panel className="fixed right-0 top-0 z-70 h-1/2 w-1/2 bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
                <div ref={navRef} className="mt-12">
                  {QuotesItems.map((E, idx) => (
                    <div key={idx} className="flex flex-col space-y-1">
                      {E.items.map((item) =>
                        item.name === buttonSelected ? (
                          <button
                            key={item.name}
                            onClick={() => handleClicked(item)}
                            className={menuItemClassHighlight}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <button
                            key={item.name}
                            onClick={() => handleClicked(item)}
                            className={menuItemClass}
                          >
                            {item.name}
                          </button>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <button
                  className="absolute -right-4 top-9 z-80 h-16 w-16 p-4 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                  aria-label="Toggle Menu"
                  onClick={onToggleNav}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
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
      </span>
    </>
  )
}
/**
 *
 */
function SlideStrategy() {
  const [navShow, setNavShow] = useState(false)
  const [buttonSelected, setButtonSelected] = useState('RSI2')
  const navRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
        // enableBodyScroll(navRef.current)
      }
      return !status
    })
  }
  const handleClicked = (item) => {
    onToggleNav()
    setButtonSelected(item.name)
    emitter.emit('SlideMenuMsg', { menu: 'Strategies', item: item, timestamp: Date.now() })
  }
  /**
   * await main menu select
   */
  emitter.on('SelectStrategiesMsg', (data) => {
    setTimeout(() => {
      setNavShow(true)
    }, 100)
  })
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
      <span id="SlideStrategies" className="md:hidden">
        <button className={menuButtonCls} aria-label="Toggle Menu" onClick={onToggleNav}>
          Strategies
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
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
                <div ref={navRef} className="mt-12 inline-block">
                  {StrategiesItems.map((E, idx) => (
                    <span key={idx}>
                      {E.items.map((item) =>
                        item.name === buttonSelected ? (
                          <button
                            key={item.name}
                            onClick={() => handleClicked(item)}
                            className={menuItemClassHighlight}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <button
                            key={item.name}
                            onClick={() => handleClicked(item)}
                            className={menuItemClass}
                          >
                            {item.name}
                          </button>
                        )
                      )}
                    </span>
                  ))}
                </div>
                <button
                  className="fixed -right-4 top-0 z-80 h-16 w-16 p-4 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
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
      </span>
    </>
  )
}
/**
 *
 */
function SlideIndicator() {
  const [navShow, setNavShow] = useState(false)
  const [buttonSelected, setButtonSelected] = useState('VOL')
  const navRef = useRef(null)

  const onToggleNav = () => {
    const M = d3.selectAll('main').select('#chart').select('#marquee')
    const Dc = M.attr('data-description')
    const fullname = M.attr('data-fullname')
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
        // enableBodyScroll(navRef.current)
      }
      return !status
    })
  }
  const handleClicked = (item) => {
    onToggleNav()
    setButtonSelected(item.name)
    emitter.emit('SlideMenuMsg', { menu: 'Indicators', item: item, timestamp: Date.now() })
  }
  /**
   * await main menu select
   */
  emitter.on('SelectIndicatorsMsg', (data) => {
    setTimeout(() => {
      setNavShow(true)
    }, 100)
  })
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
      <span id="SlideIndicators" className="md:hidden">
        <button className={menuButtonCls} aria-label="Toggle Menu" onClick={onToggleNav}>
          Indicators
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
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
              enterFrom="translate-x-0 opacity-0"
              enterTo="translate-x-full opacity-95"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-full opacity-95"
              leaveTo="translate-x-0 opacity-0"
              unmount={false}
            >
              <Dialog.Panel className="fixed left-0 top-0 z-70 h-full w-full bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
                <div ref={navRef} className="mt-12 inline-block">
                  {IndicatorsItems.map((E, idx) => (
                    <span key={idx}>
                      {E.items.map((item) =>
                        item.name === buttonSelected ? (
                          <button
                            key={item.name}
                            onClick={() => handleClicked(item)}
                            className={menuItemClassHighlight}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <button
                            key={item.name}
                            onClick={() => handleClicked(item)}
                            className={menuItemClass}
                          >
                            {item.name}
                          </button>
                        )
                      )}
                    </span>
                  ))}
                </div>
                <button
                  className="fixed -right-4 top-7 z-80 h-16 w-16 p-4 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
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
      </span>
    </>
  )
}
export default function SlideMenu() {
  return (
    <>
      <SlideQuote />
      <SlideIndicator />
      <SlideStrategy />
    </>
  )
}
