'use client'

import Image from 'next/image'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/store/BoardStore'
import fetchSuggestion from '@/lib/fetchSuggestion'

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]));

  const[loading, setLoading] = useState<boolean>(false);
  const[suggestion, setSuggestion] = useState<string>("");

  useEffect(()=> {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async() => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    }

    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 rounded-b-2xl">
        <div className="
          absolute
          left-0
          w-full
          h-96
          bg-gradient-to-br
          from-pink-400
          to-[#0055D1]
          blur-3xl
          opacity-50
          -z-50
          filter
          rounded-md
        "/>
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello logo"
          width={300}
          height={100}
          className="w-44 md:w-56 md:pb-0 object-contain"
        />
      <div className="flex items-center space-x-5 justify-end w-full">
        {/* Search box */}
        <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400"/>
            <input
            type="text"
            placeholder="Search"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="flex-1 outline-none p-2"/>
        </form>
        {/* Avatar */}
        <Avatar name="Nick" round size="50" color="#0055D1"/>
        </div>
      </div>
      {/* Uncomment the <div> below to do some GPT magic sumamrization */}
      {/* <div className="flex items-centers justify-center py-2 px-5 md:py-5">
        <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic text-[#0055D1] max-w-3xl">
          <UserCircleIcon className={`"inline-block h-10 w-10 text-[#0055D1] mr-1 ${loading && "animate-spin"}`}/>
          {suggestion && !loading ?
           suggestion :
           "GPT is summarizing your tasks"
           }
        </p>
      </div> */}
    </header>
  )
}
export default Header
