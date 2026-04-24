import React, { useEffect, useMemo, useRef, useState} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, RotateCcw, Shuffle, Sparkles, XCircle } from "lucide-react";
import { verbs } from "./data/verbs";

const persons = [
  { key: "io", label: "io" },
  { key: "tu", label: "tu" },
  { key: "lui", label: "lui/lei" },
  { key: "noi", label: "noi" },
  { key: "voi", label: "voi" },
  { key: "loro", label: "loro" },
];

const imperativePersons = [
  { key: "tu", label: "tu" },
  { key: "noi", label: "noi" },
  { key: "voi", label: "voi" },
];

const tenses = [
  { key: "presente", label: "Presente" },
  { key: "imperfetto", label: "Imperfetto" },
  { key: "futuro", label: "Futuro semplice" },
  { key: "passato", label: "Passato prossimo" },
  { key: "condizionale", label: "Condizionale" },
  { key: "imperativo", label: "Imperativo informale" },
  { key: "imperativoNegativo", label: "Imperativo negativo" }
];


const styles = `
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f8fafc; color: #0f172a; }
.app { min-height: 100vh; padding: 24px; }
.container { max-width: 1100px; margin: 0 auto; display: grid; gap: 24px; }
.header { display: flex; justify-content: space-between; gap: 18px; align-items: flex-end; }
.badge { display: inline-flex; align-items: center; gap: 8px; background: white; border: 1px solid #e2e8f0; border-radius: 999px; padding: 6px 12px; font-size: 14px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06); }
h1 { margin: 14px 0 8px; font-size: clamp(32px, 6vw, 56px); line-height: 1; letter-spacing: -0.05em; }
p { margin: 0; color: #475569; line-height: 1.5; }
.layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
.card { background: white; border: 1px solid #e2e8f0; border-radius: 24px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08); overflow: hidden; }
.cardPad { padding: 20px; }
.stats { min-width: 280px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; text-align: center; }
.statNum { font-size: 28px; font-weight: 800; }
.statLabel { font-size: 12px; color: #64748b; }
.sectionTitle { font-weight: 800; margin-bottom: 12px; }
.stack { display: grid; gap: 10px; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid #e2e8f0; border-radius: 14px; padding: 10px 12px; background: white; font-size: 14px; }
.info { background: #f1f5f9; color: #475569; border-radius: 14px; padding: 12px; font-size: 14px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; }
button { border: 0; border-radius: 14px; padding: 11px 14px; font-weight: 750; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.1s ease, opacity 0.1s ease, background 0.1s ease; }
button:active { transform: scale(0.98); }
button:disabled { opacity: 0.45; cursor: not-allowed; }
.primary { background: #0f172a; color: white; }
.secondary { background: white; color: #0f172a; border: 1px solid #cbd5e1; }
.mainCard { padding: 28px; display: grid; gap: 20px; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { background: #f1f5f9; border-radius: 999px; padding: 6px 12px; font-size: 14px; }
.tag.dark { background: #0f172a; color: white; }
.prompt { border: 1px solid #e2e8f0; border-radius: 22px; padding: 28px; background: white; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); }
.promptSmall { text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-size: 13px; font-weight: 800; }
.promptBig { margin-top: 10px; font-size: clamp(32px, 5vw, 56px); font-weight: 900; letter-spacing: -0.04em; }
.promptSub { margin-top: 10px; font-size: 20px; color: #475569; }
.input { width: 100%; border: 1px solid #cbd5e1; border-radius: 18px; padding: 16px; font-size: 20px; outline: none; }
.input:focus { box-shadow: 0 0 0 4px #cbd5e1; }
.solution { border-radius: 20px; border: 1px solid #e2e8f0; padding: 20px; background: #f8fafc; }
.solution.correct { background: #ecfdf5; border-color: #a7f3d0; }
.solution.wrong { background: #fff1f2; border-color: #fecdd3; }
.solutionLabel { color: #64748b; font-size: 14px; font-weight: 800; }
.solutionText { margin-top: 4px; font-size: 34px; font-weight: 900; }
.feedbackGood { margin-top: 10px; color: #047857; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; }
.feedbackBad { margin-top: 10px; color: #be123c; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; }
details { border: 1px solid #e2e8f0; border-radius: 20px; padding: 16px; background: white; }
summary { cursor: pointer; font-weight: 800; }
.formsGrid { margin-top: 16px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.formBox { background: #f8fafc; border-radius: 16px; padding: 14px; }
.formTitle { font-weight: 850; margin-bottom: 10px; }
.formRows { display: grid; grid-template-columns: 70px 1fr; gap: 5px 12px; font-size: 14px; }
.personLabel { color: #64748b; }
.verbList { display: flex; flex-wrap: wrap; gap: 8px; }
.verbPill { border: 1px solid #e2e8f0; background: white; border-radius: 999px; padding: 6px 12px; font-size: 14px; }
.empty { padding: 48px; text-align: center; color: #64748b; }
.icon { width: 18px; height: 18px; }
@media (max-width: 860px) { .app { padding: 14px; } .header { display: grid; } .layout { grid-template-columns: 1fr; } .stats { min-width: auto; } .formsGrid { grid-template-columns: 1fr; } }
`;

function normalize(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’`´']/g, "")
    .replace(/[.,!?;]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function expandCompactSlash(text) {
  const match = text.match(/^(.*?)([a-zàèéìòù]+)\/([a-zàèéìòù]+)(.*)$/i);
  if (!match) return [text];
  const [, before, left, right, after] = match;
  const replacement = right.length === 1 ? `${left.slice(0, -1)}${right}` : right;
  return [`${before}${left}${after}`, `${before}${replacement}${after}`].flatMap(expandCompactSlash);
}

function getAcceptedAnswers(solution) {
  return [...new Set(solution.split(/\s+\/\s+/).flatMap(expandCompactSlash).map(normalize).filter(Boolean))];
}

function answerMatches(user, solution) {
  return getAcceptedAnswers(solution).includes(normalize(user));
}

function isReflexiveVerb(verb) {
  return verb.type?.includes("reflexiv") || verb.inf.endsWith("si");
}

function buildDeck(selectedTenses, selectedTypes, includeReflexive) {
  return verbs.flatMap((verb) => {
    if (!includeReflexive && isReflexiveVerb(verb)) return [];
    if (selectedTypes.length && !selectedTypes.includes(verb.type)) return [];
    return selectedTenses.flatMap((tense) => {
      const personList =
        tense === "imperativo" || tense === "imperativoNegativo"
          ? imperativePersons
      : persons;
      return personList.flatMap((person) => {
        const answer = verb.forms[tense]?.[person.key];
        return answer && answer !== "—" ? [{ verb, tense, person, answer }] : [];
      });
    });
  });
}

function sameCard(a, b) {
  return Boolean(a && b && a.verb.inf === b.verb.inf && a.tense === b.tense && a.person.key === b.person.key);
}

function pickRandom(arr, previousCard) {
  if (!arr.length) return null;
  if (arr.length === 1) return arr[0];
  let next = arr[Math.floor(Math.random() * arr.length)];
  while (sameCard(next, previousCard)) next = arr[Math.floor(Math.random() * arr.length)];
  return next;
}

export default function App() {
  const [selectedTenses, setSelectedTenses] = useState(tenses.map((tense) => tense.key));
  const [onlyIrregular, setOnlyIrregular] = useState(true);
  const [includeReflexive, setIncludeReflexive] = useState(true);
  const [card, setCard] = useState(null);
  const [shown, setShown] = useState(false);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, seen: 0 });
  const [mode, setMode] = useState("type");
  const inputRef = useRef(null);

  const selectedTypes = useMemo(() => {
  if (!onlyIrregular) return [];

  const types = [
      "unregelmäßig",
      "teilweise unregelmäßig",
      "regelmäßig/PP unregelmäßig möglich",
    ];

    if (includeReflexive) {
      types.push("reflexiv", "reflexiv unregelmäßig");
    }

    return types;
  }, [onlyIrregular, includeReflexive]);


  const deck = useMemo(
    () => buildDeck(selectedTenses, selectedTypes, includeReflexive),
    [selectedTenses, selectedTypes, includeReflexive]
  );


  const clearAnswerState = () => {
    setShown(false);
    setGuess("");
    setStatus(null);
    setAnswered(false);
  };
  
  const focusInput = () => {
    if (mode !== "type") return;
  
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const nextCard = () => {
    if (!deck.length) {
      setCard(null);
      clearAnswerState();
      return;
    }
    setCard((currentCard) => pickRandom(deck, currentCard));
    clearAnswerState();
    setStats((currentStats) => ({ ...currentStats, seen: currentStats.seen + 1 }));
  };

  useEffect(() => {
    if (!deck.length) {
      setCard(null);
      clearAnswerState();
      return;
    }
    setCard((currentCard) => {
      const stillAvailable = deck.some((item) => sameCard(item, currentCard));
      return stillAvailable ? currentCard : pickRandom(deck, currentCard);
    });
    clearAnswerState();
  }, [deck]);

  const toggleTense = (key) => {
    setSelectedTenses((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  const checkAnswer = () => {
    if (!card || !guess.trim() || answered) return;
    const isCorrect = answerMatches(guess, card.answer);
    setStatus(isCorrect ? "correct" : "wrong");
    setShown(true);
    setAnswered(true);
    setStats((currentStats) => ({
      ...currentStats,
      correct: currentStats.correct + (isCorrect ? 1 : 0),
      wrong: currentStats.wrong + (isCorrect ? 0 : 1),
    }));
  };

  const markFlashcard = (result) => {
    if (!card || answered) return;
    setAnswered(true);
    setStats((currentStats) => ({
      ...currentStats,
      correct: currentStats.correct + (result === "correct" ? 1 : 0),
      wrong: currentStats.wrong + (result === "wrong" ? 1 : 0),
    }));
    setTimeout(nextCard, 0);
  };

  const reset = () => {
    setStats({ correct: 0, wrong: 0, seen: deck.length ? 1 : 0 });
    setCard((currentCard) => pickRandom(deck, currentCard));
    clearAnswerState();
  };

  const accuracy = stats.correct + stats.wrong ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) : 0;
  const tenseLabel = tenses.find((tense) => tense.key === card?.tense)?.label ?? "";
  const cardKey = card ? `${card.verb.inf}-${card.tense}-${card.person.key}` : "";

  useEffect(() => {
    if (mode !== "type" || !cardKey) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 250);

    return () => clearTimeout(timer);
  }, [cardKey, mode]);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="container">
          <header className="header">
            <div>
              <div className="badge"><Sparkles className="icon" /> Italienisch Verbtrainer</div>
              <h1>Konjugationen im Shuffle-Modus</h1>
              <p>Wichtige (vor allem unregelmäßige) Verben im Presente, Imperfetto, Futuro semplice, Passato prossimo, Condizionale und informellem Imperativo</p>
            </div>
            <div className="card cardPad stats">
              <div><div className="statNum">{stats.correct}</div><div className="statLabel">richtig</div></div>
              <div><div className="statNum">{stats.wrong}</div><div className="statLabel">falsch</div></div>
              <div><div className="statNum">{accuracy}%</div><div className="statLabel">Quote</div></div>
            </div>
          </header>

          <div className="layout">
            <aside className="card cardPad stack">
              <div>
                <div className="sectionTitle">Zeiten auswählen</div>
                <div className="stack">
                  {tenses.map((tense) => (
                    <label key={tense.key} className="row">
                      <span>{tense.label}</span>
                      <input type="checkbox" checked={selectedTenses.includes(tense.key)} onChange={() => toggleTense(tense.key)} />
                    </label>
                  ))}
                </div>
              </div>

              <div className="stack">
                <label className="row">
                  <span>Reflexive Verben einschließen</span>
                  <input
                    type="checkbox"
                    checked={includeReflexive}
                    onChange={(event) => setIncludeReflexive(event.target.checked)}
                  />
                </label>
                <label className="row">
                  <span>Nur unregelmäßige / wichtige Sonderfälle</span>
                  <input type="checkbox" checked={onlyIrregular} onChange={(event) => setOnlyIrregular(event.target.checked)} />
                </label>
                <label className="row">
                  <span>Antwort eintippen</span>
                  <input type="checkbox" checked={mode === "type"} onChange={(event) => setMode(event.target.checked ? "type" : "flashcard")} />
                </label>
              </div>

              <div className="info"><b>{deck.length}</b> Karten aktiv · <b>{verbs.length}</b> Verben hinterlegt</div>

              <div className="actions">
                <button className="primary" onClick={nextCard} disabled={!deck.length}><Shuffle className="icon" />Shuffle</button>
                <button className="secondary" onClick={reset} disabled={!deck.length}><RotateCcw className="icon" /></button>
              </div>
            </aside>

            <main className="card">
              {!deck.length ? (
                <div className="empty">Wähle mindestens eine Zeit aus.</div>
              ) : card ? (
                <div className="mainCard">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${card.verb.inf}-${card.tense}-${card.person.key}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.18 }}
                      className="stack"
                    >
                      <div className="tags">
                        <span className="tag dark">{card.verb.type}</span>
                        <span className="tag">{card.verb.group}</span>
                        <span className="tag">Hilfsverb: {card.verb.aux}</span>
                        <span className="tag">PP: {card.verb.pp}</span>
                      </div>

                      <div className="prompt">
                        <div className="promptSmall">Bilde die Form</div>
                        <div className="promptBig">{card.person.label} · {card.verb.inf}</div>
                        <div className="promptSub">{tenseLabel} · Deutsch: {card.verb.de}</div>
                      </div>

                      {mode === "type" && (
                        <div className="stack">
                          <input
                            key={cardKey}
                            ref={inputRef}
                            className="input"
                            placeholder="Antwort"
                            value={guess}
                            onChange={(event) => setGuess(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key !== "Enter") return;

                              if (answered) {
                                nextCard();
                                return;
                                }

                              checkAnswer();
                            }}
                          />
                          <div className="actions">
                            <button className="primary" onClick={checkAnswer} disabled={answered}>Prüfen</button>
                            <button className="secondary" onClick={() => setShown((current) => !current)}>
                              {shown ? <EyeOff className="icon" /> : <Eye className="icon" />}{shown ? "Verbergen" : "Aufdecken"}
                            </button>
                            <button className="secondary" onClick={nextCard}>Nächste</button>
                          </div>
                        </div>
                      )}

                      {mode === "flashcard" && (
                        <div className="actions">
                          <button className="primary" onClick={() => setShown((current) => !current)}>
                            {shown ? <EyeOff className="icon" /> : <Eye className="icon" />}{shown ? "Verbergen" : "Aufdecken"}
                          </button>
                          <button className="secondary" onClick={() => markFlashcard("correct")} disabled={answered}><CheckCircle2 className="icon" />Konnte ich</button>
                          <button className="secondary" onClick={() => markFlashcard("wrong")} disabled={answered}><XCircle className="icon" />Nochmal üben</button>
                        </div>
                      )}

                      <AnimatePresence>
                        {shown && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                            <div className={`solution ${status === "correct" ? "correct" : status === "wrong" ? "wrong" : ""}`}>
                              <div className="solutionLabel">Lösung</div>
                              <div className="solutionText">{card.answer}</div>
                              {status === "correct" && <div className="feedbackGood"><CheckCircle2 className="icon" />Richtig!</div>}
                              {status === "wrong" && <div className="feedbackBad"><XCircle className="icon" />Nicht ganz. Deine Antwort: {guess}</div>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <details>
                        <summary>Alle Formen von „{card.verb.inf}“ anzeigen</summary>
                        <div className="formsGrid">
                          {tenses.map((tense) => (
                            <div key={tense.key} className="formBox">
                              <div className="formTitle">{tense.label}</div>
                              <div className="formRows">
                                {(tense.key === "imperativo" || tense.key === "imperativoNegativo" ? imperativePersons : persons).map((person) => (
                                  <React.Fragment key={person.key}>
                                    <div className="personLabel">{person.label}</div>
                                    <div>{card.verb.forms[tense.key]?.[person.key] || "—"}</div>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : null}
            </main>
          </div>

          <section className="card cardPad">
            <div className="sectionTitle">Enthaltene Verben</div>
            <div className="verbList">
              {verbs.map((verb) => <span key={verb.inf} className="verbPill">{verb.inf}</span>)}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

