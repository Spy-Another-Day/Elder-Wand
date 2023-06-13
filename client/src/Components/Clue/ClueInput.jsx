import {useState} from 'react';

const ClueInput = ({ submitClue }) => {
  const [clueInput, setClueInput] = useState('');
  const [clueNumberInput, setClueNumberInput] = useState('');
  const shareHandler = () => {
    if (clueInput === '') {
      alert('Please enter a clue.')
    } else if (!(clueNumberInput === 'unlimited' || (Number.parseInt(clueNumberInput) >= 0 && Number.parseInt(clueNumberInput) <= 9))) {
      alert('Please enter a valid number of cards (0 - 9, or unlimited).' )
    } else {
      submitClue(clueInput, clueNumberInput);
    }
  }

  return (
    <div className='clue-container p-10'>
      <input
        type='text'
        value={clueInput}
        onChange={(e) => setClueInput(e.target.value)}
        placeholder='Enter your clue'
        className='input input-bordered w-80 max-w-xs'
      />
      <input
        type='text'
        value={clueNumberInput}
        onChange={(e) => setClueNumberInput(e.target.value)}
        placeholder='# of cards?'
        className='input input-bordered w-40 max-w-xs'
      />
      <input type='button' value='Share' onClick={shareHandler} className='btn'/>
    </div>
  );
}

export default ClueInput;