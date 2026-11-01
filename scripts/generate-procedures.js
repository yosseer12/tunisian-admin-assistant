const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || 'data/procedures';
fs.mkdirSync(OUT, { recursive: true });

const SRC = "https://services.interieur.gov.tn/wap/ar/docs/demarches/02.html";
const LAW_AR = "أن لا تكون له الموانع المنصوص عليها بالقانون عدد 40 لسنة 1975 المؤرخ في 14 ماي 1975 المتعلق بجوازات السفر ووثائق السفر والنصوص المنقحة والمتممة له";
const LAW_FR = "Ne pas être concerné par les interdictions de la loi n° 75-40 du 14/05/1975 relative aux passeports et aux documents de voyage";
const NAT = ["حاملا للجنسية التونسية", "Être de nationalité tunisienne"];
const LAW = [LAW_AR, LAW_FR];

const FORM = ["استمارة الحصول على جواز سفر عادي مقروء آليا مع الإمضاء", "Imprimé de demande de passeport ordinaire lisible à la machine, rempli et signé"];
const CIN = ["نسخة من بطاقة التعريف الوطنية مع الاستظهار بالأصل أو مضمون ولادة بالنسبة للقصر", "Copie de la CIN avec présentation de l'original, ou extrait de naissance pour les mineurs"];
const PHOTOS = ["04 صور شمسية بخلفية بيضاء وبحجم 3.5/4.5 سم تقريبا", "4 photos d'identité, fond blanc, environ 3,5 x 4,5 cm"];
const STUDY = ["ما يفيد الدراسة بالنسبة للتلاميذ والطلبة", "Justificatif d'études pour les élèves et étudiants"];
const GUARD = ["ترخيص الولي بالنسبة للقصر مصحوبا بنسخة من بطاقة تعريفه", "Autorisation du tuteur avec copie de sa CIN (mineurs)"];
const FEE_RCPT = ["وصل خلاص معلوم الطابع الجبائي المستوجب", "Quittance de paiement du droit de timbre fiscal"];
const OLD = ["الجواز القديم في حالة التجديد", "Ancien passeport en cas de renouvellement"];
const PLAIN = ["طلب على ورق عادي عند الرغبة في الاحتفاظ بالجواز القديم", "Demande sur papier ordinaire si vous souhaitez garder l'ancien passeport"];
const RESID = ["ما يفيد الإقامة بصفة قانونية بالخارج", "Justificatif de résidence régulière à l'étranger"];
const TO_REPLACE = ["الجواز المراد تعويضه", "Passeport à remplacer"];
const LOSS = ["شهادة ضياع جواز السفر", "Attestation de perte du passeport"];
const NEED = ["إثبات تأكد استخراج جواز سفر بوثيقة تعتمد وتثبت هذا التأكد", "Document prouvant la nécessité d'obtenir un duplicata du passeport"];
const OFF_TN = ["مركز الأمن (شرطة أو حرس وطني) حسب مرجع النظر الترابي", "Poste de sûreté (police ou garde nationale) territorialement compétent"];
const OFF_AB = ["السفارة أو القنصلية", "Ambassade ou consulat"];
const T15 = ["خلال 15 يوما من تاريخ تقديم الطلب", "15 jours à compter du dépôt de la demande"];
const TINV = ["بعد استكمال التحريات وإتمام الإجراءات اللازمة", "Après l'achèvement des enquêtes et des procédures nécessaires (pas de délai fixe)"];

const pair = (items) => ({ fr: items.map(i => i[1]), ar: items.map(i => i[0]) });
const one = (t) => ({ fr: t[1], ar: t[0] });

function make(id, titleAr, titleFr, cond, steps, docs, fees, office, delay, notes) {
  const d = {
    id, title_fr: titleFr, title_ar: titleAr,
    conditions: pair(cond),
    steps: { derived: true, ...pair(steps) },
    documents: pair(docs),
    fees,
    office: one(office),
    processing_time: one(delay),
    source_url: SRC, source_language: "ar",
    notes: notes || "French text translated from the Arabic official page; review before publishing.",
    last_verified: "2026-11-01", verified: true,
  };
  fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(d, null, 2), 'utf8');
  console.log('written', id + '.json');
}

make("passport-renewal-abroad",
  "الحصول على جواز سفر لأول مرة أو تجديده بالنسبة للتونسيين المقيمين بالخارج",
  "Obtention ou renouvellement d'un passeport (résidents à l'étranger)",
  [NAT, LAW],
  [["تعمير الاستمارة وإمضاؤها شخصيا", "Remplir et signer personnellement l'imprimé de demande"],
   ["تجميع الوثائق المطلوبة", "Réunir les pièces à fournir"],
   ["دفع معلوم الطابع الجبائي بما يعادله بالعملة الأجنبية", "Payer le droit de timbre fiscal (équivalent en devises)"],
   ["إيداع الملف بالسفارة أو القنصلية", "Déposer le dossier à l'ambassade ou au consulat"],
   ["استلام الجواز خلال 15 يوما من تاريخ تقديم الطلب", "Récupérer le passeport dans les 15 jours suivant le dépôt"]],
  [FORM, CIN, PHOTOS, STUDY, GUARD, FEE_RCPT, OLD, PLAIN, RESID],
  { fr: "Équivalent en devises de 25 TND pour les élèves, étudiants et enfants de moins de 6 ans ; équivalent en devises de 80 TND pour les autres",
    ar: "ما يعادل 25 دنانير تونسية بالعملة الأجنبية للتلاميذ والطلبة والأطفال دون 6 سنوات؛ ما يعادل 80 دينارا تونسيا بالعملة الأجنبية للبقية" },
  OFF_AB, T15);

make("passport-change-tn",
  "تغيير جواز سفر عادي بالنسبة للتونسيين المقيمين بالتراب التونسي",
  "Changement d'un passeport ordinaire (résidents en Tunisie)",
  [["حصول تغيير في أحد عناصر الهوية", "Changement d'un élément d'identité"],
   ["أو أصبح الجواز باليا أو غير صالح للاستعمال أو بسبب نفاذ الصفحات", "Ou passeport usé, inutilisable ou dont les pages sont épuisées (l'une des deux conditions)"],
   LAW],
  [["تعمير الاستمارة وإمضاؤها شخصيا", "Remplir et signer personnellement l'imprimé de demande"],
   ["تجميع الوثائق المطلوبة بما فيها الجواز المراد تعويضه", "Réunir les pièces à fournir, dont le passeport à remplacer"],
   ["دفع معلوم الطابع الجبائي", "Payer le droit de timbre fiscal"],
   ["إيداع الملف بمركز الأمن حسب مرجع النظر الترابي", "Déposer le dossier au poste de sûreté compétent"],
   ["استلام الجواز خلال 15 يوما", "Récupérer le passeport dans les 15 jours"]],
  [FORM, TO_REPLACE, CIN, PHOTOS, GUARD, STUDY, FEE_RCPT],
  { fr: "25 TND pour les élèves, étudiants et enfants de moins de 6 ans ; 150 TND pour les passeports usés ou détériorés ; 80 TND pour les autres",
    ar: "25 دنانير للتلاميذ والطلبة والأطفال دون 6 سنوات؛ 150 دينارا للجوازات البالية أو المشوهة؛ 80 دينارا للبقية" },
  OFF_TN, T15);

make("passport-change-abroad",
  "تغيير جواز سفر عادي بالنسبة للتونسيين المقيمين بالخارج",
  "Changement d'un passeport ordinaire (résidents à l'étranger)",
  [["حصول تغيير في أحد عناصر الهوية", "Changement d'un élément d'identité"],
   ["أو أصبح الجواز باليا أو غير صالح للاستعمال أو بسبب نفاذ صفحاته", "Ou passeport usé, inutilisable ou dont les pages sont épuisées (l'une des deux conditions)"],
   LAW],
  [["تعمير الاستمارة وإمضاؤها شخصيا", "Remplir et signer personnellement l'imprimé de demande"],
   ["تجميع الوثائق المطلوبة بما فيها الجواز المراد تعويضه", "Réunir les pièces à fournir, dont le passeport à remplacer"],
   ["دفع معلوم الطابع الجبائي بما يعادله بالعملة الأجنبية", "Payer le droit de timbre fiscal (équivalent en devises)"],
   ["إيداع الملف بالسفارة أو القنصلية", "Déposer le dossier à l'ambassade ou au consulat"],
   ["استلام الجواز خلال 15 يوما", "Récupérer le passeport dans les 15 jours"]],
  [FORM, TO_REPLACE, CIN, PHOTOS, GUARD, STUDY, RESID, FEE_RCPT],
  { fr: "Équivalent en devises de 25 TND pour les élèves, étudiants et enfants de moins de 6 ans ; équivalent de 150 TND pour les passeports usés ou détériorés ; équivalent de 80 TND pour les autres",
    ar: "ما يعادل 25 دنانير تونسية بالعملة الأجنبية للتلاميذ والطلبة والأطفال دون 6 سنوات؛ 150 دينارا للجوازات البالية أو المشوهة؛ ما يعادل 80 دينارا تونسيا بالعملة الأجنبية للبقية" },
  OFF_AB, T15,
  "French translated from the Arabic official page. The Arabic page lists the 150 TND fee for worn/altered passports in a slightly confusing way (receipt line + currency equivalents): confirm the foreign-currency amount with the consulate.");

make("passport-duplicate-tn",
  "استخراج نظير من جواز سفر (من أجل السرقة أو الضياع أو الإتلاف) بالنسبة إلى التونسيين المقيمين بالتراب التونسي",
  "Obtention d'un duplicata de passeport - perte, vol ou détérioration (résidents en Tunisie)",
  [LAW,
   ["استيفاء التحريات اللازمة", "Achèvement des enquêtes nécessaires"],
   ["تأكد الحاجة لاستخراج جواز سفر", "Nécessité avérée d'obtenir un duplicata"]],
  [["تعمير الاستمارة وإمضاؤها شخصيا", "Remplir et signer personnellement l'imprimé de demande"],
   ["تجميع الوثائق المطلوبة بما فيها شهادة ضياع الجواز", "Réunir les pièces à fournir, dont l'attestation de perte"],
   ["دفع معلوم الطابع الجبائي (150 دينارا)", "Payer le droit de timbre fiscal (150 TND)"],
   ["إيداع الملف بمركز الأمن حسب مرجع النظر الترابي", "Déposer le dossier au poste de sûreté compétent"],
   ["انتظار استكمال التحريات والإجراءات اللازمة", "Attendre l'achèvement des enquêtes et des procédures"]],
  [FORM, CIN, PHOTOS, LOSS, GUARD, STUDY,
   ["وصل خلاص معلوم الطابع الجبائي المستوجب (150 دينارا)", "Quittance de paiement du droit de timbre fiscal (150 TND)"], NEED],
  { fr: "150 TND (droit de timbre fiscal)", ar: "150 دينارا (معلوم الطابع الجبائي)" },
  OFF_TN, TINV);

make("passport-duplicate-abroad",
  "استخراج نظير من جواز سفر (من أجل السرقة أو الضياع أو الإتلاف) بالنسبة إلى التونسيين المقيمين بالخارج",
  "Obtention d'un duplicata de passeport - perte, vol ou détérioration (résidents à l'étranger)",
  [LAW,
   ["استيفاء التحريات اللازمة", "Achèvement des enquêtes nécessaires"],
   ["تأكد الحاجة لاستخراج جواز السفر", "Nécessité avérée d'obtenir un duplicata"]],
  [["تعمير الاستمارة وإمضاؤها شخصيا", "Remplir et signer personnellement l'imprimé de demande"],
   ["تجميع الوثائق المطلوبة بما فيها شهادة ضياع الجواز", "Réunir les pièces à fournir, dont l'attestation de perte"],
   ["دفع معلوم الطابع الجبائي (150 دينارا أو ما يعادلها بالعملة الأجنبية)", "Payer le droit de timbre fiscal (150 TND ou équivalent en devises)"],
   ["إيداع الملف بالسفارة أو القنصلية", "Déposer le dossier à l'ambassade ou au consulat"],
   ["انتظار استكمال التحريات والإجراءات اللازمة", "Attendre l'achèvement des enquêtes et des procédures"]],
  [FORM, CIN, PHOTOS, LOSS, GUARD, STUDY, RESID,
   ["وصل خلاص معلوم الطابع الجبائي المستوجب (150 دينارا أو ما يعادلها من العملة الأجنبية)", "Quittance de paiement du droit de timbre fiscal (150 TND ou équivalent en devises)"], NEED],
  { fr: "150 TND ou équivalent en devises", ar: "150 دينارا أو ما يعادلها من العملة الأجنبية" },
  OFF_AB, TINV);

make("travel-document-pilgrimage",
  "الحج",
  "Document de voyage pour le pèlerinage",
  [["أن يكون المنتفع بالرخصة مدرج ضمن القائمة النهائية للحجيج الصادرة عن السلطة المسؤولة", "Figurer sur la liste finale des pèlerins établie par l'autorité compétente"],
   ["ورود القائمة المذكورة على إدارة الحدود والأجانب", "La liste doit avoir été transmise à la Direction des frontières et des étrangers"],
   ["أن يكون المنتفع خال من الموانع المنصوص عليها بالقانون عدد 40 لسنة 1975 المتعلق بجوازات السفر ووثائق السفر", "Ne pas être concerné par les interdictions de la loi n° 75-40 de 1975"]],
  [["تأكد من إدراج الاسم بالقائمة النهائية للحجيج", "Vérifier que votre nom figure sur la liste finale des pèlerins"],
   ["تجميع الوثائق المطلوبة", "Réunir les pièces à fournir"],
   ["إيداع الملف بالمقر المختص", "Déposer le dossier au bureau compétent"],
   ["استلام الوثيقة حينيا أو خلال 24 ساعة", "Récupérer le document immédiatement ou sous 24 heures"]],
  [["نسخة من بطاقة التعريف الوطنية", "Copie de la CIN"], ["04 صور شمسية", "4 photos d'identité"]],
  { fr: "Non précisé sur la page officielle", ar: "غير مذكور بالصفحة الرسمية" },
  ["بالنسبة لإقليم تونس: مقر إدارة الحدود والأجانب (بورصة الشغل بتونس)؛ بالنسبة للولايات الأخرى: مقر المنطقة الجهوية للأمن الوطني أو الأماكن التي يتم تخصيصها للغرض",
   "District de Tunis : Direction des frontières et des étrangers (Bourse du travail, Tunis) ; autres gouvernorats : siège de la sûreté nationale régionale ou lieux désignés à cet effet"],
  ["حينيا أو خلال 24 ساعة من تقديم الملف", "Immédiatement ou dans les 24 heures suivant le dépôt du dossier"],
  "Page heading on the official site is only 'الحج'; title_fr/ar fields describe the service. Fees not stated on the page.");