export default function Pagination (
  { selectedCard, setSelectedCard, amountOfRequests }:
  { selectedCard: number, setSelectedCard: (card: number) => void, amountOfRequests: number }
) {
  const handlePreviusButton = () => {
    if (selectedCard > 0) {
      setSelectedCard(selectedCard - 1)
    }
  }

  const handleNextButton = () => {
    if (selectedCard < amountOfRequests - 1) {
      setSelectedCard(selectedCard + 1)
    }
  }

  return (
    <nav aria-label='Pagination delivery man requests'>
      <ul className='inline-flex -space-x-px'>
        <li>
          <button
            className='px-3 py-2 ml-0 leading-tight border border-yellow-500 rounded-l-lg hover:bg-al-orange'
            onClick={handlePreviusButton}
          >Previous
          </button>
        </li>
        {
            [...Array(amountOfRequests)].map((_, i) => (
              <li key={i}>
                {
                    selectedCard === i
                      ? (
                        <button
                          onClick={() => setSelectedCard(i)}
                          className='px-3 py-2 leading-tight bg-al-orange border-yellow-500 border hover:bg-al-orange'
                        >
                          {i + 1}
                        </button>
                        )
                      : (
                        <button
                          onClick={() => setSelectedCard(i)}
                          className='px-3 py-2 leading-tight border-yellow-500 border hover:bg-al-orange'
                        >
                          {i + 1}
                        </button>
                        )
                }
              </li>
            ))
        }
        <li>
          <button
            className='px-3 py-2 leading-tight border border-yellow-500 rounded-r-lg hover:bg-al-orange'
            onClick={handleNextButton}
          >Next
          </button>
        </li>
      </ul>
    </nav>

  )
}
