import {
  BookOpen,
  Heart,
  Home,
  Printer,
  RefreshCw,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { DragEvent, ReactNode, useMemo, useState } from 'react';

type NeedLevel = 'body' | 'safety' | 'belonging' | 'respect' | 'hope';
type Screen = 'welcome' | 'build' | 'scenarios' | 'rebuild' | 'reflect' | 'final';

type NeedCard = {
  id: string;
  label: string;
  level: NeedLevel;
};

type Scenario = {
  id: string;
  title: string;
  affectedLevel: NeedLevel;
  detail: string;
};

type HelperAction = {
  id: string;
  label: string;
  levels: NeedLevel[];
  explanation: string;
};

const levels: Array<{
  id: NeedLevel;
  label: string;
  icon: ReactNode;
  color: string;
  shortName: string;
}> = [
  {
    id: 'hope',
    label: 'Hope & Purpose',
    shortName: 'Hope',
    icon: <Star aria-hidden="true" />,
    color: 'bg-[#7666a8]',
  },
  {
    id: 'respect',
    label: 'Respect',
    shortName: 'Respect',
    icon: <Sparkles aria-hidden="true" />,
    color: 'bg-[#d96c5f]',
  },
  {
    id: 'belonging',
    label: 'Belonging',
    shortName: 'Belonging',
    icon: <Heart aria-hidden="true" />,
    color: 'bg-[#4b8fbd]',
  },
  {
    id: 'safety',
    label: 'Safety',
    shortName: 'Safety',
    icon: <Shield aria-hidden="true" />,
    color: 'bg-[#2f7d6d]',
  },
  {
    id: 'body',
    label: 'Body Needs',
    shortName: 'Body',
    icon: <Home aria-hidden="true" />,
    color: 'bg-[#f3b33d]',
  },
];

const needCards: NeedCard[] = [
  { id: 'food', label: 'Food', level: 'body' },
  { id: 'family', label: 'Family', level: 'belonging' },
  { id: 'safe-harm', label: 'Safety from harm', level: 'safety' },
  { id: 'dreams', label: 'Dreams for the future', level: 'hope' },
  { id: 'water', label: 'Water', level: 'body' },
  { id: 'fairly', label: 'Being treated fairly', level: 'respect' },
  { id: 'friends', label: 'Friends', level: 'belonging' },
  { id: 'sleep', label: 'Sleep', level: 'body' },
  { id: 'learn', label: 'Freedom to learn', level: 'hope' },
  { id: 'school-community', label: 'School/community', level: 'belonging' },
  { id: 'shelter', label: 'Shelter', level: 'body' },
  { id: 'name', label: 'Having your name respected', level: 'respect' },
];

const scenarios: Scenario[] = [
  {
    id: 'homes',
    title: 'People are forced from their homes.',
    affectedLevel: 'body',
    detail: 'Without a safe place to live, people struggle to meet body needs.',
  },
  {
    id: 'places',
    title: 'People are told they cannot go to certain places.',
    affectedLevel: 'safety',
    detail: 'Unfair rules can make people feel unsafe and trapped.',
  },
  {
    id: 'separated',
    title: 'Families and communities are separated.',
    affectedLevel: 'belonging',
    detail: 'People need family, friends, and community.',
  },
  {
    id: 'labels',
    title: 'People are called names or forced to wear labels.',
    affectedLevel: 'respect',
    detail:
      'Labels and name-calling are used to make people seem less important. That is false and wrong.',
  },
  {
    id: 'learn-dream',
    title: 'Children are not allowed to learn or dream freely.',
    affectedLevel: 'hope',
    detail: 'People need the chance to learn, grow, and imagine a future.',
  },
];

const helperActions: HelperAction[] = [
  {
    id: 'supplies',
    label: 'Share food and supplies',
    levels: ['body'],
    explanation: 'Sharing food and supplies helps people care for their bodies and feel supported.',
  },
  {
    id: 'find-safety',
    label: 'Help people find safety',
    levels: ['safety'],
    explanation: 'Helping people find safety protects them from harm and fear.',
  },
  {
    id: 'connected',
    label: 'Keep families and communities connected',
    levels: ['belonging'],
    explanation: 'Keeping people connected reminds them they are not alone.',
  },
  {
    id: 'real-names',
    label: "Use people's real names and speak respectfully",
    levels: ['respect'],
    explanation: 'Using real names and respectful words shows that every person matters.',
  },
  {
    id: 'learn',
    label: 'Make sure every child can learn',
    levels: ['hope'],
    explanation: 'Learning helps children grow their ideas and imagine a future.',
  },
  {
    id: 'truth',
    label: 'Check facts before sharing claims',
    levels: ['safety'],
    explanation: 'Checking facts stops false ideas from spreading and helps keep people safer.',
  },
  {
    id: 'excluded',
    label: 'Stand up when someone is excluded',
    levels: ['belonging'],
    explanation: 'Standing up for someone helps them feel included and protected by the group.',
  },
  {
    id: 'stories',
    label: "Listen to people's stories",
    levels: ['hope'],
    explanation: 'Listening to stories honors memory and helps people feel seen.',
  },
];

const emotions = ['Sad', 'Scared', 'Lonely', 'Angry', 'Confused'];
const emotionFeedback: Record<string, string> = {
  Sad: 'Sadness can show that something important has been taken away. Everyone deserves care.',
  Scared: 'Feeling scared is understandable when safety is missing. Everyone deserves protection.',
  Lonely: 'Loneliness reminds us that people need family, friends, and community.',
  Angry: 'Anger can tell us that something is unfair. Fairness and dignity matter.',
  Confused: 'Confusion can happen when rules are unfair or unkind. Truth helps people feel steadier.',
};
const sentenceStarters = [
  'I can include someone by...',
  'I can speak up when...',
  'I can question unfair ideas by...',
  'I can show respect by...',
];

const levelOrderFromBase: NeedLevel[] = ['body', 'safety', 'belonging', 'respect', 'hope'];

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [placedCards, setPlacedCards] = useState<Record<string, NeedLevel>>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [buildFeedback, setBuildFeedback] = useState('Choose a card, then click a pyramid level.');
  const [successCardId, setSuccessCardId] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [scenarioEmotions, setScenarioEmotions] = useState<Record<string, string>>({});
  const [restoredLevels, setRestoredLevels] = useState<NeedLevel[]>([]);
  const [helperFeedback, setHelperFeedback] = useState('Choose a helper action to restore a need.');
  const [starter, setStarter] = useState(sentenceStarters[0]);
  const [reflection, setReflection] = useState('');

  const placedCount = Object.keys(placedCards).length;
  const completedBuild = placedCount === needCards.length;
  const exploredAll = scenarios.every((scenario) => scenarioEmotions[scenario.id]);
  const harmedLevels = useMemo(
    () => Array.from(new Set(scenarios.map((scenario) => scenario.affectedLevel))),
    [],
  );
  const rebuiltAll = harmedLevels.every((level) => restoredLevels.includes(level));
  const finalReflection = `${starter.replace('...', '')} ${reflection}`.trim();

  const reset = () => {
    setScreen('welcome');
    setPlacedCards({});
    setSelectedCardId(null);
    setBuildFeedback('Choose a card, then click a pyramid level.');
    setSuccessCardId(null);
    setActiveScenarioId(null);
    setScenarioEmotions({});
    setRestoredLevels([]);
    setHelperFeedback('Choose a helper action to restore a need.');
    setStarter(sentenceStarters[0]);
    setReflection('');
  };

  const placeCard = (cardId: string, levelId: NeedLevel) => {
    const card = needCards.find((item) => item.id === cardId);
    if (!card || placedCards[cardId]) return;

    if (card.level === levelId) {
      setPlacedCards((current) => ({ ...current, [cardId]: levelId }));
      setSelectedCardId(null);
      setBuildFeedback('Yes. Everyone needs this.');
      setSuccessCardId(cardId);
      window.setTimeout(() => setSuccessCardId(null), 700);
      return;
    }

    setBuildFeedback('Try again. Where would this need help someone most?');
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>, levelId: NeedLevel) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    placeCard(cardId, levelId);
  };

  const chooseScenario = (scenario: Scenario) => {
    setActiveScenarioId(scenario.id);
  };

  const chooseEmotion = (scenarioId: string, emotion: string) => {
    setScenarioEmotions((current) => ({ ...current, [scenarioId]: emotion }));
  };

  const restoreWithHelper = (action: HelperAction) => {
    setRestoredLevels((current) =>
      Array.from(new Set([...current, ...action.levels])) as NeedLevel[],
    );
    setHelperFeedback(`${action.explanation} This helps rebuild human dignity.`);
  };

  return (
    <main className="min-h-screen bg-chalk text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="no-print flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#263238]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-meadow text-white shadow-soft">
              <Users aria-hidden="true" size={28} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-meadow">
                Human dignity activity
              </p>
              <h1 className="text-2xl font-black sm:text-3xl">Build Maslow's Pyramid</h1>
            </div>
          </div>
          <TeacherNotes />
        </header>

        {screen === 'welcome' && (
          <WelcomeScreen onStart={() => setScreen('build')} />
        )}

        {screen === 'build' && (
          <section className="grid flex-1 gap-6 py-6 lg:grid-cols-[1fr_390px]">
            <div>
              <SectionHeading
                eyebrow={`Cards placed: ${placedCount} / ${needCards.length}`}
                title="Build the Pyramid"
                text="Put each need where it helps a person most. You can drag a card or click a card, then click a level."
              />
              <Pyramid
                placedCards={placedCards}
                removedLevels={[]}
                restoredLevels={[]}
                onLevelClick={(levelId) => selectedCardId && placeCard(selectedCardId, levelId)}
                onDropCard={handleDrop}
                successCardId={successCardId}
              />
              <Feedback message={buildFeedback} />
              {completedBuild && (
                <CompletionPanel
                  message="You built a strong pyramid. When people have these needs met, they can feel safe, loved, respected, and hopeful."
                  buttonText="Continue"
                  onClick={() => setScreen('scenarios')}
                />
              )}
            </div>
            <CardBank
              selectedCardId={selectedCardId}
              placedCards={placedCards}
              onSelect={setSelectedCardId}
            />
          </section>
        )}

        {screen === 'scenarios' && (
          <section className="grid flex-1 gap-6 py-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionHeading
                eyebrow="What happens when needs are taken away?"
                title="Needs and fairness"
                text="During genocides, leaders and groups use unfair laws, fear, and false beliefs to take away people's needs. This is wrong. Learning about it helps us prevent it."
              />
              <Pyramid
                placedCards={Object.fromEntries(needCards.map((card) => [card.id, card.level]))}
                removedLevels={scenarios
                  .filter((scenario) => scenarioEmotions[scenario.id])
                  .map((scenario) => scenario.affectedLevel)}
                restoredLevels={[]}
                compact
              />
            </div>
            <ScenarioPanel
              activeScenarioId={activeScenarioId}
              scenarioEmotions={scenarioEmotions}
              onChooseScenario={chooseScenario}
              onChooseEmotion={chooseEmotion}
              onContinue={() => setScreen('rebuild')}
              exploredAll={exploredAll}
            />
          </section>
        )}

        {screen === 'rebuild' && (
          <section className="grid flex-1 gap-6 py-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading
                eyebrow={`${restoredLevels.length} / ${harmedLevels.length} layers restored`}
                title="Rebuild with helper actions"
                text="Upstanders use care, truth, and courage to protect human dignity."
              />
              <Pyramid
                placedCards={Object.fromEntries(needCards.map((card) => [card.id, card.level]))}
                removedLevels={harmedLevels}
                restoredLevels={restoredLevels}
                compact
              />
              <Feedback message={helperFeedback} />
            </div>
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {helperActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => restoreWithHelper(action)}
                    className="rounded-2xl border-4 border-white bg-white p-4 text-left text-lg font-bold shadow-soft transition hover:-translate-y-1 hover:border-meadow"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              {rebuiltAll && (
                <CompletionPanel
                  message="Genocide begins with false beliefs and unfair actions. Prevention begins with truth, respect, courage, and care."
                  buttonText="Reflect"
                  onClick={() => setScreen('reflect')}
                />
              )}
            </div>
          </section>
        )}

        {screen === 'reflect' && (
          <ReflectionScreen
            starter={starter}
            reflection={reflection}
            onStarter={setStarter}
            onReflection={setReflection}
            onFinish={() => setScreen('final')}
          />
        )}

        {screen === 'final' && (
          <FinalScreen reflection={finalReflection} onRestart={reset} />
        )}
      </div>
    </main>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid flex-1 place-items-center py-10">
      <div className="w-full max-w-4xl rounded-[2rem] border-4 border-white bg-white p-8 text-center shadow-soft sm:p-12">
        <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-sun text-ink">
          <Home aria-hidden="true" size={48} />
        </div>
        <h2 className="text-5xl font-black sm:text-6xl">Build Maslow's Pyramid</h2>
        <p className="mx-auto mt-5 max-w-2xl text-2xl font-semibold text-ink/80">
          What do people need to live, feel safe, and belong?
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 rounded-2xl bg-meadow px-10 py-4 text-2xl font-black text-white shadow-soft transition hover:-translate-y-1"
        >
          Start
        </button>
        <p className="mx-auto mt-7 max-w-2xl text-sm font-semibold text-ink/60">
          Teacher note: This demo discusses unfair treatment and the Holocaust in a careful,
          non-graphic way.
        </p>
      </div>
    </section>
  );
}

function TeacherNotes() {
  return (
    <details className="max-w-xl rounded-2xl bg-white px-4 py-3 shadow-soft">
      <summary className="cursor-pointer text-base font-black text-meadow">Teacher Notes</summary>
      <div className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-ink/75">
        <p>This activity connects Maslow's hierarchy to human dignity.</p>
        <p>
          It can be paired with age-appropriate excerpts or themes from <em>Night</em> by Elie
          Wiesel, especially memory, witnessing, and responsibility.
        </p>
        <p>
          Pause after each scenario and ask students: What need was taken? What action could
          protect that need?
        </p>
        <p>
          Jewish people and other targeted groups were harmed because of false, hateful beliefs.
          Those beliefs were wrong. Every human being has equal dignity.
        </p>
      </div>
    </details>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-base font-black uppercase tracking-wide text-meadow">{eyebrow}</p>
      <h2 className="mt-1 text-4xl font-black sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-xl font-semibold leading-relaxed text-ink/75">{text}</p>
    </div>
  );
}

function Pyramid({
  placedCards,
  removedLevels,
  restoredLevels,
  onLevelClick,
  onDropCard,
  successCardId,
  compact = false,
}: {
  placedCards: Record<string, NeedLevel>;
  removedLevels: NeedLevel[];
  restoredLevels: NeedLevel[];
  onLevelClick?: (level: NeedLevel) => void;
  onDropCard?: (event: DragEvent<HTMLButtonElement>, level: NeedLevel) => void;
  successCardId?: string | null;
  compact?: boolean;
}) {
  const widths: Record<NeedLevel, string> = {
    hope: 'w-[46%]',
    respect: 'w-[60%]',
    belonging: 'w-[74%]',
    safety: 'w-[88%]',
    body: 'w-full',
  };

  return (
    <div className={`mx-auto flex w-full max-w-4xl flex-col items-center gap-2 ${compact ? 'mt-4' : ''}`}>
      {levels.map((level) => {
        const cards = needCards.filter((card) => placedCards[card.id] === level.id);
        const dimmed = removedLevels.includes(level.id) && !restoredLevels.includes(level.id);
        const restored = restoredLevels.includes(level.id);

        return (
          <button
            key={level.id}
            type="button"
            onClick={() => onLevelClick?.(level.id)}
            onDrop={(event) => onDropCard?.(event, level.id)}
            onDragOver={(event) => event.preventDefault()}
            className={`${widths[level.id]} min-h-[92px] rounded-2xl border-4 border-white p-3 text-left text-white shadow-soft transition ${level.color} ${
              onLevelClick ? 'hover:-translate-y-1 hover:ring-4 hover:ring-sun' : ''
            } ${dimmed ? 'opacity-40 grayscale' : ''} ${restored ? 'animate-glow ring-4 ring-meadow/40' : ''}`}
            aria-label={`${level.label} pyramid level`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xl font-black sm:text-2xl">
                <span className="h-7 w-7">{level.icon}</span>
                {level.label}
              </span>
              {dimmed && (
                <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-black text-ink">
                  Need taken away
                </span>
              )}
              {restored && (
                <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-black text-meadow">
                  Restored
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {cards.map((card) => (
                <span
                  key={card.id}
                  className={`rounded-full bg-white px-3 py-1 text-sm font-black text-ink ${
                    successCardId === card.id ? 'animate-pop' : ''
                  }`}
                >
                  {card.label}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CardBank({
  selectedCardId,
  placedCards,
  onSelect,
}: {
  selectedCardId: string | null;
  placedCards: Record<string, NeedLevel>;
  onSelect: (cardId: string) => void;
}) {
  return (
    <aside className="rounded-[1.5rem] bg-white p-5 shadow-soft">
      <h3 className="text-2xl font-black">Need cards</h3>
      <p className="mt-1 text-base font-semibold text-ink/65">
        Drag a card, or click one and then choose a pyramid level.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {needCards.map((card) => {
          const placed = Boolean(placedCards[card.id]);
          const selected = selectedCardId === card.id;

          return (
            <button
              key={card.id}
              type="button"
              draggable={!placed}
              disabled={placed}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', card.id)}
              onClick={() => onSelect(card.id)}
              className={`rounded-2xl border-4 p-4 text-left text-lg font-black transition ${
                selected
                  ? 'border-sun bg-[#fff6d9]'
                  : 'border-[#263238]/10 bg-chalk hover:border-meadow'
              } ${placed ? 'cursor-default opacity-45' : 'hover:-translate-y-1'}`}
            >
              {card.label}
              {placed && <span className="ml-2 text-sm text-meadow">Placed</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ScenarioPanel({
  activeScenarioId,
  scenarioEmotions,
  onChooseScenario,
  onChooseEmotion,
  exploredAll,
  onContinue,
}: {
  activeScenarioId: string | null;
  scenarioEmotions: Record<string, string>;
  onChooseScenario: (scenario: Scenario) => void;
  onChooseEmotion: (scenarioId: string, emotion: string) => void;
  exploredAll: boolean;
  onContinue: () => void;
}) {
  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId);

  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onChooseScenario(scenario)}
            className={`rounded-2xl border-4 bg-white p-4 text-left shadow-soft transition hover:-translate-y-1 ${
              activeScenarioId === scenario.id ? 'border-sun' : 'border-white'
            }`}
          >
            <span className="text-sm font-black uppercase text-meadow">Scenario {index + 1}</span>
            <span className="mt-1 block text-xl font-black">{scenario.title}</span>
            {scenarioEmotions[scenario.id] && (
              <span className="mt-2 inline-block rounded-full bg-meadow px-3 py-1 text-sm font-black text-white">
                Explored
              </span>
            )}
          </button>
        ))}
      </div>

      {activeScenario && (
        <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
          <p className="text-lg font-bold text-ink/75">{activeScenario.detail}</p>
          <h3 className="mt-4 text-2xl font-black">
            How might someone feel if this need was taken away?
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => onChooseEmotion(activeScenario.id, emotion)}
                className="rounded-2xl bg-sky px-5 py-3 text-lg font-black text-white shadow-soft transition hover:-translate-y-1"
              >
                {emotion}
              </button>
            ))}
          </div>
          {scenarioEmotions[activeScenario.id] && (
            <Feedback
              message={`${emotionFeedback[scenarioEmotions[activeScenario.id]]} Everyone deserves this need.`}
            />
          )}
        </div>
      )}

      {exploredAll && (
        <CompletionPanel
          message="You explored each need with care."
          buttonText="How can we rebuild?"
          onClick={onContinue}
        />
      )}
    </div>
  );
}

function ReflectionScreen({
  starter,
  reflection,
  onStarter,
  onReflection,
  onFinish,
}: {
  starter: string;
  reflection: string;
  onStarter: (starter: string) => void;
  onReflection: (reflection: string) => void;
  onFinish: () => void;
}) {
  return (
    <section className="grid flex-1 place-items-center py-8">
      <div className="w-full max-w-4xl rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
        <SectionHeading
          eyebrow="Reflection"
          title="What is one thing you can do?"
          text="Think of one way to help others feel safe, included, and respected."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {sentenceStarters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onStarter(option)}
              className={`rounded-2xl border-4 p-4 text-left text-lg font-black transition hover:-translate-y-1 ${
                starter === option ? 'border-sun bg-[#fff6d9]' : 'border-[#263238]/10 bg-chalk'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <label className="mt-6 block text-xl font-black" htmlFor="reflection">
          Your response
        </label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(event) => onReflection(event.target.value)}
          maxLength={180}
          rows={4}
          className="mt-2 w-full rounded-2xl border-4 border-[#263238]/10 bg-chalk p-4 text-xl font-semibold"
          placeholder="write your idea here"
        />
        <button
          type="button"
          onClick={onFinish}
          disabled={!reflection.trim()}
          className="mt-5 rounded-2xl bg-meadow px-8 py-4 text-xl font-black text-white shadow-soft transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Finish
        </button>
      </div>
    </section>
  );
}

function FinalScreen({ reflection, onRestart }: { reflection: string; onRestart: () => void }) {
  return (
    <section className="grid flex-1 place-items-center py-8">
      <div className="print-card w-full max-w-4xl rounded-[2rem] border-4 border-white bg-white p-8 text-center shadow-soft sm:p-12">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sun text-ink">
          <BookOpen aria-hidden="true" size={42} />
        </div>
        <p className="mt-6 text-lg font-black uppercase tracking-wide text-meadow">
          My Human Dignity Promise
        </p>
        <h2 className="mt-2 text-4xl font-black sm:text-5xl">Every person matters</h2>
        <p className="mx-auto mt-6 max-w-3xl text-2xl font-semibold leading-relaxed text-ink/80">
          I believe every person deserves body needs, safety, belonging, respect, and hope. I will
          help stop unfair ideas by choosing kindness, truth, and courage.
        </p>
        <div className="mt-8 rounded-2xl bg-chalk p-5 text-left">
          <p className="text-sm font-black uppercase text-meadow">My reflection</p>
          <p className="mt-2 text-xl font-bold">{reflection}</p>
        </div>
        <div className="no-print mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky px-6 py-3 text-lg font-black text-white shadow-soft transition hover:-translate-y-1"
          >
            <RefreshCw aria-hidden="true" />
            Restart
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-2xl bg-meadow px-6 py-3 text-lg font-black text-white shadow-soft transition hover:-translate-y-1"
          >
            <Printer aria-hidden="true" />
            Print Pledge
          </button>
        </div>
      </div>
    </section>
  );
}

function Feedback({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-2xl border-4 border-white bg-white px-5 py-4 text-xl font-black text-meadow shadow-soft">
      {message}
    </div>
  );
}

function CompletionPanel({
  message,
  buttonText,
  onClick,
}: {
  message: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-5 rounded-[1.5rem] bg-[#fff6d9] p-5 shadow-soft">
      <p className="text-xl font-black leading-relaxed text-ink">{message}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 rounded-2xl bg-meadow px-7 py-3 text-xl font-black text-white shadow-soft transition hover:-translate-y-1"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default App;
