'use client'

import * as d3 from 'd3'
import DOMPurify from 'dompurify'
import { Dialog, Transition } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'

export function SlideStrategy() {
  const [navShow, setNavShow] = useState(false)
  const [dataTitle, setDataTitle] = useState('Volume')
  const [dataContent, setDataContent] = useState(
    `Stock trading volume is the total number of shares, contracts, or units of a security traded between buyers and sellers during a specific period, typically a single trading day.`
  )
  const navRef = useRef(null)

  const onToggleNav = () => {
    const M = d3.selectAll('main').select('#chart').select('#marquee')
    const Dc = M.attr('data-strategy')
    const fullname = M.attr('data-fullname')
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        //disableBodyScroll(navRef.current)
        enableBodyScroll(navRef.current)
        if (Dc.length > 0) {
          setDataTitle(fullname)
          const safeHTML = DOMPurify.sanitize(Dc)
          setDataContent(safeHTML)
        }
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })
  return (
    <>
      <span id="SlideDescription" className="md:hidden">
        <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 25"
            fill="currentColor"
            className="h-8 w-8 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.475 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
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
                <div
                  ref={navRef}
                  className="mt-8 flex h-full basis-0 flex-col items-start gap-4 overflow-y-auto pl-12 pt-2 text-left"
                >
                  <div id="Description-Title">{dataTitle}</div>
                  <div
                    className="whitespace-pre-wrap bg-[#F5F5F5] text-xs text-slate-950 dark:bg-stone-900 dark:text-lime-300"
                    id="Description-Content"
                    dangerouslySetInnerHTML={{ __html: dataContent }}
                  />
                </div>
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
      </span>
    </>
  )
}
export function SlideIndicator() {
  const [navShow, setNavShow] = useState(false)
  const [dataTitle, setDataTitle] = useState('Volume')
  const [dataContent, setDataContent] = useState(
    `Stock trading volume is the total number of shares, contracts, or units of a security traded between buyers and sellers during a specific period, typically a single trading day.`
  )
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
        //disableBodyScroll(navRef.current)
        enableBodyScroll(navRef.current)
        if (Dc.length > 0) {
          setDataTitle(fullname)
          const safeHTML = DOMPurify.sanitize(Dc)
          setDataContent(safeHTML)
        }
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })
  return (
    <>
      <span id="SlideDescription" className="md:hidden">
        <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 25"
            fill="currentColor"
            className="h-8 w-8 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.475 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
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
              enterFrom="translate-x-0 opacity-0"
              enterTo="translate-x-full opacity-95"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-full opacity-95"
              leaveTo="translate-x-0 opacity-0"
              unmount={false}
            >
              <Dialog.Panel className="fixed left-0 top-0 z-70 h-full w-full bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
                <div
                  ref={navRef}
                  className="mt-8 flex h-full basis-0 flex-col items-start gap-4 overflow-y-auto pl-12 pt-2 text-left"
                >
                  <div id="Description-Title">{dataTitle}</div>
                  <div
                    className="whitespace-pre-wrap bg-[#F5F5F5] text-xs text-slate-950 dark:bg-stone-900 dark:text-lime-300"
                    id="Description-Content"
                    dangerouslySetInnerHTML={{ __html: dataContent }}
                  />
                </div>
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
      </span>
    </>
  )
}
export default function SlideDescription() {
  return (
    <>
      <div className="flex items-center justify-between">
        <SlideIndicator />
        <SlideStrategy />
      </div>
    </>
  )
}
