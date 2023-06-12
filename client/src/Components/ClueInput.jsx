import {useState} from 'react';

const ClueInput = ({ submitClue }) => {
  const [clueInput, setClueInput] = useState('waiting for clue...');
  const [clueNumberInput, setClueNumberInput] = useState('');

  <div className='clue-container'>
    <input type='text' value={clueInput} onChange={(e) => setClueInput(e.target.value)} />
    <input type='text' value={clueNumberInput} onChange={(e) => setClueNumberInput(e.target.value)} />
    <input type='button' value='Share' onClick={() => submitClue(clueInput, clueNumberInput)} />
  </div>
}