import { useMemo, useState } from "react";
import "./MentalHealthTest.css";

const choices = ["أبداً", "لأيام قليلة", "لأكثر من نصف الأيام", "شبه يومياً"];

const phqQuestions = [
  "قلة الاهتمام أو المتعة في القيام بالأشياء.",
  "الشعور بالإحباط، الكآبة، أو اليأس.",
  "صعوبة في النوم، أو الاستمرار فيه، أو النوم بكثرة.",
  "الشعور بالتعب أو قلة الطاقة.",
  "ضعف الشهية أو الإفراط في الأكل.",
  "شعور سيء تجاه نفسك، أو أنك فاشل أو خذلت نفسك أو عائلتك.",
  "صعوبة في التركيز على الأمور، مثل قراءة الصحف أو مشاهدة التلفزيون.",
  "الحركة أو التحدث ببطء شديد بحيث يمكن للآخرين ملاحظته، أو عكس ذلك: التململ والتوتر وكثرة الحركة أكثر من المعتاد.",
  "أفكار بأنه سيكون من الأفضل لو مت، أو إيذاء نفسك بطريقة ما.",
];

const gadQuestions = [
  "الشعور بالتوتر، والقلق، أو العصبية.",
  "عدم القدرة على إيقاف أو التحكم في القلق.",
  "القلق المفرط بشأن أمور مختلفة.",
  "صعوبة الاسترخاء.",
  "التوتر لدرجة صعوبة الجلوس بهدوء.",
  "سرعة الانفعال أو الغضب بسهولة.",
  "الشعور بالخوف كأن شيئاً فظيعاً سيحدث.",
];

const panicQuestions = [
  "تسارع ضربات القلب أو خفقان قوي.",
  "تعرق شديد.",
  "رجفة أو ارتعاش.",
  "ضيق في التنفس أو شعور بالاختناق.",
  "ألم أو عدم راحة في الصدر.",
  "غثيان أو اضطراب في البطن.",
  "دوخة، دوار، أو شعور بالإغماء.",
];

const getDepressionLevel = (score) => {
  if (score <= 4) return "لا يوجد اكتئاب (ضمن الطبيعي)";
  if (score <= 9) return "اكتئاب خفيف";
  if (score <= 14) return "اكتئاب متوسط";
  if (score <= 19) return "اكتئاب متوسط إلى شديد";
  return "اكتئاب شديد";
};

const getAnxietyLevel = (score) => {
  if (score <= 4) return "قلق في الحد الطبيعي";
  if (score <= 9) return "قلق خفيف";
  if (score <= 14) return "قلق متوسط";
  return "قلق شديد";
};

function QuestionGroup({ title, instruction, questions, answers, onChange }) {
  return (
    <section className="mht-section">
      <div className="mht-section__heading">
        <h2>{title}</h2>
        <p>{instruction}</p>
      </div>

      <div className="mht-questions">
        {questions.map((question, index) => (
          <div className="mht-question" key={index}>
            <p className="mht-question__text">
              <span>{index + 1}.</span> {question}
            </p>

            <div className="mht-options">
              {choices.map((choice, value) => (
                <label
                  className={`mht-option ${
                    answers[index] === value ? "selected" : ""
                  }`}
                  key={value}
                >
                  <input
                    type="radio"
                    name={`${title}-${index}`}
                    value={value}
                    checked={answers[index] === value}
                    onChange={() => onChange(index, value)}
                  />
                  <span className="mht-option__radio" />
                  <span>{choice}</span>
                  <small>{value}</small>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MentalHealthTest() {
  const [phqAnswers, setPhqAnswers] = useState({});
  const [gadAnswers, setGadAnswers] = useState({});
  const [panicAnswer, setPanicAnswer] = useState("");
  const [panicSymptoms, setPanicSymptoms] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const phqScore = useMemo(
    () => Object.values(phqAnswers).reduce((sum, value) => sum + value, 0),
    [phqAnswers],
  );

  const gadScore = useMemo(
    () => Object.values(gadAnswers).reduce((sum, value) => sum + value, 0),
    [gadAnswers],
  );

  const panicPositive = panicAnswer === "yes" && panicSymptoms.length >= 4;

  const phqComplete = Object.keys(phqAnswers).length === 9;
  const gadComplete = Object.keys(gadAnswers).length === 7;
  const panicComplete =
    panicAnswer === "no" ||
    (panicAnswer === "yes" && panicSymptoms.length >= 0);

  const canSubmit =
    phqComplete && gadComplete && panicComplete && panicAnswer !== "";

  const updateAnswer = (setter) => (index, value) => {
    setter((previous) => ({
      ...previous,
      [index]: value,
    }));
    setSubmitted(false);
  };

  const togglePanicSymptom = (index) => {
    setPanicSymptoms((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index],
    );
    setSubmitted(false);
  };

  const handlePanicAnswer = (value) => {
    setPanicAnswer(value);

    if (value === "no") {
      setPanicSymptoms([]);
    }

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    setSubmitted(true);

    setTimeout(() => {
      document
        .getElementById("mht-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const resetTest = () => {
    setPhqAnswers({});
    setGadAnswers({});
    setPanicAnswer("");
    setPanicSymptoms([]);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="mentallTest" className="mentallTest">
      <main className="mht" dir="rtl">
        <div className="mht-container">
          <header className="mht-header">
            <span className="mht-header__label">التقييم النفسي</span>
            <h1>البطارية الإكلينيكية المختصرة</h1>
            <h3>
              منظومة فحص سريعة للشخصية، الاكتئاب، القلق، ونوبات الهلع مع مفتاح
              التصحيح الآلي
            </h3>
            <p>
              يرجى الإجابة عن الأسئلة التالية بدقة، وفقاً لما شعرت به خلال
              الفترات الزمنية الموضحة في كل قسم.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {/* PHQ-9 */}

            <QuestionGroup
              title="القسم الأول: مقياس الاكتئاب (PHQ-9)"
              instruction="خلال الأسابيع الأربعة الماضية، كم مرة أزعجتك أي من المشكلات التالية؟"
              questions={phqQuestions}
              answers={phqAnswers}
              onChange={updateAnswer(setPhqAnswers)}
            />

            {/* GAD-7 */}

            <QuestionGroup
              title="القسم الثاني: مقياس القلق العام (GAD-7)"
              instruction="خلال الأسبوعين الماضيين، كم مرة أزعجتك المشكلات التالية؟"
              questions={gadQuestions}
              answers={gadAnswers}
              onChange={updateAnswer(setGadAnswers)}
            />

            {/* Panic screening */}

            <section className="mht-section">
              <div className="mht-section__heading">
                <h2>القسم الثالث: مسح أعراض نوبات الهلع</h2>
                <p>
                  هل تعرضت خلال الشهر الماضي لنوبات مفاجئة من الخوف الشديد أو
                  عدم الراحة بلغت ذروتها خلال دقائق معدودة؟
                </p>
              </div>

              <div className="mht-yes-no">
                <label
                  className={`mht-yes-no__option ${
                    panicAnswer === "yes" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="panic"
                    checked={panicAnswer === "yes"}
                    onChange={() => handlePanicAnswer("yes")}
                  />
                  نعم
                </label>

                <label
                  className={`mht-yes-no__option ${
                    panicAnswer === "no" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="panic"
                    checked={panicAnswer === "no"}
                    onChange={() => handlePanicAnswer("no")}
                  />
                  لا
                </label>
              </div>

              {panicAnswer === "yes" && (
                <div className="mht-panic">
                  <h3>
                    هل صاحب النوبة أربعة أعراض أو أكثر من الأعراض التالية؟
                  </h3>

                  <p className="mht-panic__hint">
                    يمكنك اختيار جميع الأعراض التي تعرضت لها.
                  </p>

                  <div className="mht-panic__list">
                    {panicQuestions.map((question, index) => (
                      <label
                        className={`mht-panic__item ${
                          panicSymptoms.includes(index) ? "selected" : ""
                        }`}
                        key={index}
                      >
                        <input
                          type="checkbox"
                          checked={panicSymptoms.includes(index)}
                          onChange={() => togglePanicSymptom(index)}
                        />
                        <span className="mht-checkbox" />
                        {question}
                      </label>
                    ))}
                  </div>

                  <p className="mht-panic__count">
                    عدد الأعراض المختارة: {panicSymptoms.length} من 7
                  </p>
                </div>
              )}
            </section>

            {/* Submit */}

            <div className="mht-actions">
              <button
                type="submit"
                className="mht-submit"
                disabled={!canSubmit}
              >
                عرض نتائج التقييم
              </button>

              <button type="button" className="mht-reset" onClick={resetTest}>
                إعادة الاختبار
              </button>
            </div>

            {!canSubmit && (
              <p className="mht-validation">
                يرجى الإجابة عن جميع أسئلة الاكتئاب والقلق، وتحديد إجابة سؤال
                نوبات الهلع قبل عرض النتائج.
              </p>
            )}
          </form>

          {/* Results */}

          {submitted && (
            <section className="mht-results" id="mht-results">
              <div className="mht-results__heading">
                <span>ملخص التقييم</span>
                <h2>نتائج المقاييس النفسية</h2>
                <p>
                  هذه النتائج مبدئية وتحتاج إلى مراجعة وتفسير من مختص بالصحة
                  النفسية.
                </p>
              </div>

              <div className="mht-result-grid">
                <article className="mht-result-card">
                  <span>مقياس الاكتئاب PHQ-9</span>
                  <strong>{phqScore} / 27</strong>
                  <p>{getDepressionLevel(phqScore)}</p>
                </article>

                <article className="mht-result-card">
                  <span>مقياس القلق GAD-7</span>
                  <strong>{gadScore} / 21</strong>
                  <p>{getAnxietyLevel(gadScore)}</p>
                </article>

                <article className="mht-result-card">
                  <span>مسح أعراض نوبات الهلع</span>
                  <strong>
                    {panicAnswer === "no"
                      ? "سلبي مبدئياً"
                      : `${panicSymptoms.length} / 7`}
                  </strong>
                  <p>
                    {panicAnswer === "no"
                      ? "لم يتم الإبلاغ عن نوبات مفاجئة"
                      : panicPositive
                        ? "نتيجة إيجابية مبدئياً"
                        : "لم تتحقق معايير الفحص المبدئي"}
                  </p>
                </article>
              </div>

              {phqAnswers[8] > 0 && (
                <div className="mht-alert mht-alert--danger">
                  <strong>تنبيه سريري مهم - البند التاسع من PHQ-9</strong>
                  <p>
                    أشار المريض إلى وجود أفكار متعلقة بالموت أو إيذاء النفس. يجب
                    إجراء تقييم مباشر وفوري لمخاطر إيذاء الذات، بغض النظر عن
                    مجموع المقياس. لا تكفي هذه الإجابة وحدها لتحديد مستوى الخطر.
                  </p>
                </div>
              )}

              {panicPositive && (
                <div className="mht-alert">
                  <strong>تنبيه: نتيجة إيجابية مبدئياً لفحص الهلع</strong>
                  <p>
                    وجود نوبات مفاجئة مع أربعة أعراض أو أكثر يستدعي استكمال
                    المقابلة الإكلينيكية والتقييم التفصيلي.
                  </p>
                </div>
              )}

              <div className="mht-results__note">
                <strong>ملاحظة:</strong>
                <p>
                  هذه المقاييس أدوات مسح أولية وليست بديلاً عن التقييم والتشخيص
                  السريري من قبل الطبيب أو المختص.
                </p>
              </div>

              <button type="button" className="mht-reset" onClick={resetTest}>
                إجراء تقييم جديد
              </button>
            </section>
          )}
        </div>
      </main>
    </section>
  );
}
