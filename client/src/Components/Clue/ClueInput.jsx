import {useState} from 'react';

const ClueInput = ({ submitClue }) => {
  const [clueInput, setClueInput] = useState('');
  const [clueNumberInput, setClueNumberInput] = useState('');

  return (
    <div className='clue-container'>
      <input
        type='text'
        value={clueInput}
        onChange={(e) => setClueInput(e.target.value)}
        placeholder='Enter your clue'
        className='input input-ghost w-full max-w-xs'
      />
      <input
        type='text'
        value={clueNumberInput}
        onChange={(e) => setClueNumberInput(e.target.value)}
        placeholder='Enter the number of cards'
        className='input input-bordered w-full max-w-xs'
      />
      <input type='button' value='Share' onClick={() => submitClue(clueInput, clueNumberInput)} className='btn'/>
    </div>
  );
}

export default ClueInput;