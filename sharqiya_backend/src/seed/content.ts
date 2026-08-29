/**
 * Seed content for Al-Sharqiya Gypsum & GRC Group.
 *
 * Every fact here comes from the client-supplied company profile
 * (`data/profile/Sharqiya profile.pdf`) and `data/profile/aboutus.txt`.
 * Image keys refer to entries in `media-library.json`.
 */

export interface L {
  en: string;
  ar: string;
}

const LIBRARY = '/uploads/media/library';

/** Resolves a media-library key to its public URL. */
export const img = (key: string): string => `${LIBRARY}/${key}.webp`;

const image = (key: string, en: string, ar: string, order = 0) => ({
  src: img(key),
  alt: { en, ar },
  order,
});

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const settings = {
  siteName: {
    en: 'Al-Sharqiya Gypsum & GRC Group',
    ar: 'مجموعة الشرقية للجبس والـ GRC',
  },
  tagline: {
    en: 'Finishing the UAE since 1986',
    ar: 'نُنجز تشطيبات الإمارات منذ 1986',
  },
  shortDescription: {
    en: 'Gypsum and GRC manufacturing, epoxy flooring, painting and waterproofing across Abu Dhabi, Dubai, Al Ain and Ajman.',
    ar: 'صناعة الجبس والـ GRC، وأرضيات الإيبوكسي، والدهانات، والعزل المائي في أبوظبي ودبي والعين وعجمان.',
  },
  contact: {
    email: 'alsharqiagypsum@gmail.com',
    phone: '+971 56 848 9888',
    phoneAlt: '+971 50 555 2521',
    whatsapp: '971568489888',
    headOffice: {
      en: 'Al Ain, United Arab Emirates',
      ar: 'العين، الإمارات العربية المتحدة',
    },
  },
  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
  },
  branches: [
    {
      city: { en: 'Al Ain', ar: 'العين' },
      address: {
        en: 'Al Ain, Abu Dhabi Emirate — head office and gypsum factory',
        ar: 'العين، إمارة أبوظبي — المكتب الرئيسي ومصنع الجبس',
      },
      phone: '+971 56 848 9888',
      mapUrl: '',
      order: 0,
    },
    {
      city: { en: 'Abu Dhabi', ar: 'أبوظبي' },
      address: {
        en: 'Abu Dhabi — projects and contracting office',
        ar: 'أبوظبي — مكتب المشاريع والمقاولات',
      },
      phone: '+971 50 555 2521',
      mapUrl: '',
      order: 1,
    },
    {
      city: { en: 'Dubai', ar: 'دبي' },
      address: {
        en: 'Dubai — flooring and painting operations',
        ar: 'دبي — عمليات الأرضيات والدهانات',
      },
      phone: '+971 50 555 2521',
      mapUrl: '',
      order: 2,
    },
    {
      city: { en: 'Ajman', ar: 'عجمان' },
      address: {
        en: 'Ajman — northern emirates branch',
        ar: 'عجمان — فرع الإمارات الشمالية',
      },
      phone: '+971 56 848 9888',
      mapUrl: '',
      order: 3,
    },
  ],
  openingHours: [
    { day: { en: 'Monday', ar: 'الاثنين' }, open: '08:00', close: '18:00', closed: false },
    { day: { en: 'Tuesday', ar: 'الثلاثاء' }, open: '08:00', close: '18:00', closed: false },
    { day: { en: 'Wednesday', ar: 'الأربعاء' }, open: '08:00', close: '18:00', closed: false },
    { day: { en: 'Thursday', ar: 'الخميس' }, open: '08:00', close: '18:00', closed: false },
    { day: { en: 'Friday', ar: 'الجمعة' }, open: '08:00', close: '13:00', closed: false },
    { day: { en: 'Saturday', ar: 'السبت' }, open: '08:00', close: '18:00', closed: false },
    { day: { en: 'Sunday', ar: 'الأحد' }, open: '', close: '', closed: true },
  ],
  foundedYear: 1986,
  logo: img('logo-mark'),
  tradeLicense: '',
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const services = [
  {
    slug: 'gypsum-grc',
    order: 0,
    icon: 'layers',
    name: { en: 'Gypsum & GRC', ar: 'الجبس والـ GRC' },
    excerpt: {
      en: 'Manufacturing and installation of gypsum, GRG and GRC elements from a catalogue of more than 2,500 mould designs.',
      ar: 'تصنيع وتركيب عناصر الجبس والـ GRG والـ GRC من كتالوج يضم أكثر من 2,500 تصميم قالب.',
    },
    description: {
      en: 'Gypsum and GRC is where Al-Sharqiya began in 1986, and it remains the heart of the group. From our own moulds we produce cornices, ceiling roses, columns, domes, arches, screens and decorative wall panels, then install them on site with our own finishing teams. Our library of over 2,500 designs spans Moroccan, Islamic, modern and classical vocabularies, so a specification can be matched exactly rather than approximated. As one of the longest-established GRG suppliers in the United Arab Emirates we have delivered both government and private work for four decades.',
      ar: 'بدأت الشرقية بأعمال الجبس والـ GRC في عام 1986، وما زالت تشكّل جوهر المجموعة. ننتج من قوالبنا الخاصة الكرانيش والزخارف السقفية والأعمدة والقباب والأقواس والمشربيات والألواح الجدارية الزخرفية، ثم نُركّبها في الموقع بأيدي فرقنا المتخصصة. تشمل مكتبتنا أكثر من 2,500 تصميم تغطي الطرز المغربية والإسلامية والحديثة والكلاسيكية، بما يتيح مطابقة المواصفات بدقة لا بالتقريب. وبوصفنا من أقدم موردي الـ GRG في الإمارات العربية المتحدة، نفّذنا مشاريع حكومية وخاصة على مدى أربعة عقود.',
    },
    features: [
      { en: 'GRG and GRC mouldings cast from our own 2,500+ design library', ar: 'قوالب GRG و GRC مصبوبة من مكتبة تصاميمنا التي تضم أكثر من 2,500 تصميم' },
      { en: 'Suspended and decorative gypsum ceilings', ar: 'أسقف جبسية مستعارة وزخرفية' },
      { en: 'Cornices, coving, ceiling roses and light troughs', ar: 'كرانيش وحواف وزخارف سقفية ومجاري إضاءة' },
      { en: 'Columns, capitals, domes and arches', ar: 'أعمدة وتيجان وقباب وأقواس' },
      { en: 'Three-dimensional decorative wall panels', ar: 'ألواح جدارية زخرفية ثلاثية الأبعاد' },
      { en: 'Moroccan, Islamic, modern and classical design families', ar: 'عائلات تصميم مغربية وإسلامية وحديثة وكلاسيكية' },
      { en: 'Custom moulds produced to a client drawing', ar: 'قوالب مخصّصة تُنتج وفق مخطط العميل' },
    ],
    specs: [
      { label: { en: 'Experience', ar: 'الخبرة' }, value: { en: 'Since 1986', ar: 'منذ 1986' } },
      { label: { en: 'Mould designs', ar: 'تصاميم القوالب' }, value: { en: 'More than 2,500', ar: 'أكثر من 2,500' } },
      { label: { en: 'Styles', ar: 'الطرز' }, value: { en: 'Moroccan, Islamic, modern, classical', ar: 'مغربي، إسلامي، حديث، كلاسيكي' } },
      { label: { en: 'Sectors', ar: 'القطاعات' }, value: { en: 'Government and private', ar: 'حكومي وخاص' } },
    ],
    sections: [
      {
        heading: { en: 'Made in our own factory', ar: 'صناعة في مصنعنا' },
        body: {
          en: 'Because the moulds and the castings are ours, we control the profile, the thickness and the finish. That shortens lead times on large repeat runs and makes bespoke pieces practical rather than expensive. Our Al Ain factory serves projects across all four of our branch emirates.',
          ar: 'لأن القوالب وعمليات الصب ملك لنا، فإننا نتحكم في المقطع والسماكة والتشطيب. وهذا يقصّر مدد التنفيذ في الكميات المتكررة الكبيرة، ويجعل القطع المخصّصة عملية لا مكلفة. ويخدم مصنعنا في العين مشاريع في الإمارات الأربع التي نعمل بها.',
        },
        images: [
          image('grc-decorative-wave-panel', 'Three-dimensional decorative GRC wave wall panel', 'لوح جداري مموج ثلاثي الأبعاد من الجي آر سي'),
        ],
      },
      {
        heading: { en: 'Installed by our own teams', ar: 'تركيب بأيدي فرقنا' },
        body: {
          en: 'Supply and fixing stay under one contract, so setting out, jointing and the final skim are the responsibility of a single party. Our fixers work to the ceiling grid and services coordination agreed on site, and hand over surfaces ready for paint.',
          ar: 'يبقى التوريد والتركيب في عقد واحد، فتكون أعمال التخطيط والوصلات والطبقة النهائية مسؤولية جهة واحدة. تعمل فرقنا وفق شبكة الأسقف وتنسيق الخدمات المتفق عليه في الموقع، وتُسلّم أسطحاً جاهزة للدهان.',
        },
        images: [
          image('gypsum-ceiling-installation', 'Technician fixing gypsum board to a suspended ceiling frame', 'فني يقوم بتثبيت ألواح الجبس على هيكل السقف المستعار'),
        ],
      },
    ],
    coverImage: img('gypsum-ceiling-installation'),
    gallery: [
      image('gypsum-ceiling-installation', 'Gypsum ceiling installation in progress', 'أعمال تركيب سقف جبسي', 0),
      image('grc-decorative-wave-panel', 'Decorative GRC wave panel', 'لوح GRC مموج زخرفي', 1),
      image('interior-room-white-finish', 'Interior finished and ready for handover', 'تشطيب داخلي جاهز للتسليم', 2),
    ],
    seo: {
      title: { en: 'Gypsum & GRC Contractors in the UAE', ar: 'مقاولو الجبس والـ GRC في الإمارات' },
      description: {
        en: 'Al-Sharqiya manufactures and installs gypsum, GRG and GRC elements across the UAE, with more than 2,500 mould designs. Established 1986.',
        ar: 'تُصنّع الشرقية وتُركّب عناصر الجبس والـ GRG والـ GRC في الإمارات، بأكثر من 2,500 تصميم قالب. تأسست عام 1986.',
      },
    },
  },
  {
    slug: 'epoxy-flooring',
    order: 1,
    icon: 'layout-grid',
    name: { en: 'Flooring & Surface Treatment', ar: 'الأرضيات ومعالجة الأسطح' },
    excerpt: {
      en: 'Epoxy, polyurethane and micro cement floor systems for warehouses, factories, car parks, villas and decorative interiors.',
      ar: 'أنظمة أرضيات إيبوكسي وبولي يوريثان ومايكرو سمنت للمستودعات والمصانع والمواقف والفلل والتشطيبات الزخرفية.',
    },
    description: {
      en: 'We specialise in high-performance floor systems and the surface preparation that makes them last. The work covers warehouses, factories, workshops, car parks, villas and decorative floors, using epoxy, polyurethane, micro cement and other advanced systems selected against the loads, chemicals and traffic the floor will actually see. Substrate preparation — grinding, shot blasting, crack and joint treatment, moisture control — is carried out in-house, because a coating is only as good as what it is bonded to. Our largest single epoxy contract to date covered 10,000 m² at the RTA Jebel Ali bus depot.',
      ar: 'نتخصص في أنظمة الأرضيات عالية الأداء وفي تحضير الأسطح الذي يمنحها العمر الطويل. تشمل أعمالنا المستودعات والمصانع والورش والمواقف والفلل والأرضيات الزخرفية، باستخدام الإيبوكسي والبولي يوريثان والمايكرو سمنت وأنظمة متقدمة أخرى تُختار وفق الأحمال والمواد الكيميائية وحركة المرور الفعلية. ونُنفّذ تحضير الأرضية — الجلي والتجليخ ومعالجة الشقوق والفواصل والتحكم في الرطوبة — بأيدينا، لأن جودة الطلاء لا تتجاوز جودة السطح الملتصق به. وأكبر عقد إيبوكسي منفرد نفّذناه حتى اليوم بلغ 10,000 متر مربع في مستودع حافلات جبل علي التابع لهيئة الطرق والمواصلات.',
    },
    features: [
      { en: 'Self-levelling and roller-applied epoxy floor systems', ar: 'أنظمة أرضيات إيبوكسي ذاتية التسوية وبالرول' },
      { en: 'Polyurethane floors for thermal and chemical exposure', ar: 'أرضيات بولي يوريثان للتعرض الحراري والكيميائي' },
      { en: 'Micro cement and decorative seamless floors', ar: 'مايكرو سمنت وأرضيات زخرفية بلا فواصل' },
      { en: 'Anti-slip, anti-static and heavy-duty screeds', ar: 'طبقات مانعة للانزلاق ومضادة للكهرباء الساكنة وشديدة التحمل' },
      { en: 'Grinding, shot blasting and crack and joint treatment', ar: 'جلي وتجليخ ومعالجة الشقوق والفواصل' },
      { en: 'Line marking, bay numbering, signs and floor lettering', ar: 'خطوط أرضية وترقيم مواقف ولافتات وكتابات على الأرضية' },
      { en: 'Car park, warehouse and workshop floor refurbishment', ar: 'تجديد أرضيات المواقف والمستودعات والورش' },
    ],
    specs: [
      { label: { en: 'Systems', ar: 'الأنظمة' }, value: { en: 'Epoxy, polyurethane, micro cement', ar: 'إيبوكسي، بولي يوريثان، مايكرو سمنت' } },
      { label: { en: 'Largest contract', ar: 'أكبر عقد' }, value: { en: '10,000 m² in a single depot', ar: '10,000 م² في مستودع واحد' } },
      { label: { en: 'Applications', ar: 'التطبيقات' }, value: { en: 'Warehouses, factories, car parks, villas', ar: 'مستودعات، مصانع، مواقف، فلل' } },
      { label: { en: 'Includes', ar: 'يشمل' }, value: { en: 'Substrate preparation and line marking', ar: 'تحضير الأسطح والخطوط الأرضية' } },
    ],
    sections: [
      {
        heading: { en: 'Specified against real loads', ar: 'مواصفات تُحدَّد وفق الأحمال الفعلية' },
        body: {
          en: 'A bus depot, a food factory and a villa living room are three different problems. We survey the substrate, confirm moisture and soundness, then propose the system, thickness and finish that suit the traffic, cleaning regime and chemical exposure — not simply the cheapest coat that will look right on the day of handover.',
          ar: 'مستودع حافلات ومصنع أغذية وصالة فيلا ثلاث مسائل مختلفة. نفحص الأرضية القائمة، ونتحقق من الرطوبة والسلامة، ثم نقترح النظام والسماكة والتشطيب المناسب لحركة المرور ونظام التنظيف والتعرض الكيميائي — لا مجرد أرخص طبقة تبدو جيدة يوم التسليم.',
        },
        images: [
          image('warehouse-polished-floor', 'Large warehouse hall with a seamless floor finish', 'قاعة مستودع كبيرة بأرضية بلا فواصل'),
        ],
      },
      {
        heading: { en: 'Marking and wayfinding included', ar: 'الخطوط والدلالات ضمن العمل' },
        body: {
          en: 'Lane lines, walkways, hatching, bay numbers, signage and floor lettering are set out and applied by the same crew that laid the floor, so colours, edges and coating build-up match across the whole area.',
          ar: 'تُخطَّط وتُنفَّذ خطوط المسارات وممرات المشاة والتهشير وأرقام المواقف واللافتات والكتابات الأرضية بواسطة الفريق نفسه الذي نفّذ الأرضية، فتتطابق الألوان والحدود وسماكات الطلاء في كامل المنطقة.',
        },
        images: [
          image('depot-floor-yellow-lining', 'Depot floor with fresh yellow lane markings', 'أرضية مستودع بخطوط مسارات صفراء جديدة'),
        ],
      },
    ],
    coverImage: img('bus-depot-epoxy-walkway'),
    gallery: [
      image('bus-depot-epoxy-walkway', 'Green epoxy walkway with yellow lining', 'ممر إيبوكسي أخضر مع خطوط صفراء', 0),
      image('depot-floor-yellow-lining', 'Depot floor lane marking', 'خطوط مسارات في أرضية المستودع', 1),
      image('workshop-bay-line-marking', 'Numbered workshop service bay', 'خليج خدمة مرقّم في الورشة', 2),
      image('warehouse-polished-floor', 'Warehouse hall floor finish', 'تشطيب أرضية قاعة المستودع', 3),
      image('workshop-yellow-line-marking', 'Industrial safety line marking', 'خطوط أمان صناعية', 4),
      image('service-corridor-green-epoxy', 'Service corridor in green epoxy', 'ممر خدمي بإيبوكسي أخضر', 5),
    ],
    seo: {
      title: { en: 'Epoxy & Industrial Flooring Contractors in the UAE', ar: 'مقاولو أرضيات الإيبوكسي والأرضيات الصناعية في الإمارات' },
      description: {
        en: 'Epoxy, polyurethane and micro cement flooring for warehouses, factories and car parks across the UAE, including line marking. 10,000 m² delivered in a single depot.',
        ar: 'أرضيات إيبوكسي وبولي يوريثان ومايكرو سمنت للمستودعات والمصانع والمواقف في الإمارات، مع الخطوط الأرضية. نفّذنا 10,000 م² في مستودع واحد.',
      },
    },
  },
  {
    slug: 'painting',
    order: 2,
    icon: 'paintbrush',
    name: { en: 'Painting & Coatings', ar: 'الدهانات والطلاءات' },
    excerpt: {
      en: 'Interior and exterior painting for residential, commercial and industrial projects, delivered through our Art Colors division.',
      ar: 'دهانات داخلية وخارجية للمشاريع السكنية والتجارية والصناعية، تُنفَّذ من خلال قسم Art Colors.',
    },
    description: {
      en: 'Under the name Art Colors, Al-Sharqiya works as both distributor and applicator for leading paint brands. We carry out all types of interior and exterior painting for residential, commercial and industrial projects, together with decorative painting, surface restoration and treatment. Because we supply the material and apply it, the specification, the warranty and the workmanship sit with one party. Recent work includes exterior and interior painting for RTA office buildings and accommodation at Jebel Ali, Al Quoz, Al Ruwayyah and Al Qusais, a 2,000 m² warehouse exterior, and villa facades in Jumeirah.',
      ar: 'تعمل الشرقية تحت اسم Art Colors كموزّع ومنفّذ لعلامات دهانات رائدة. ننفّذ جميع أنواع الدهانات الداخلية والخارجية للمشاريع السكنية والتجارية والصناعية، إلى جانب الدهانات الزخرفية وترميم الأسطح ومعالجتها. ولأننا نورّد المادة ونُنفّذها، تبقى المواصفة والضمان وجودة التنفيذ في يد جهة واحدة. وتشمل أعمالنا الحديثة دهانات خارجية وداخلية لمباني مكاتب ومساكن هيئة الطرق والمواصلات في جبل علي والقوز والرويّة والقصيص، وواجهة مستودع بمساحة 2,000 متر مربع، وواجهات فلل في جميرا.',
    },
    features: [
      { en: 'Interior painting for residential and commercial interiors', ar: 'دهانات داخلية للمساحات السكنية والتجارية' },
      { en: 'Exterior and facade painting, including high-level access', ar: 'دهانات خارجية وواجهات، بما يشمل العمل على ارتفاعات' },
      { en: 'Industrial and protective coatings', ar: 'طلاءات صناعية وواقية' },
      { en: 'Decorative and textured finishes', ar: 'تشطيبات زخرفية وذات ملمس' },
      { en: 'Surface restoration, crack repair and treatment', ar: 'ترميم الأسطح ومعالجة الشقوق' },
      { en: 'Supply and application as an authorised distributor', ar: 'توريد وتنفيذ بصفة موزّع معتمد' },
      { en: 'Occupied-building programmes with phased handover', ar: 'برامج تنفيذ في مبانٍ مأهولة مع تسليم مرحلي' },
    ],
    specs: [
      { label: { en: 'Division', ar: 'القسم' }, value: { en: 'Art Colors', ar: 'Art Colors' } },
      { label: { en: 'Role', ar: 'الدور' }, value: { en: 'Distributor and applicator', ar: 'موزّع ومنفّذ' } },
      { label: { en: 'Sectors', ar: 'القطاعات' }, value: { en: 'Residential, commercial, industrial, government', ar: 'سكني، تجاري، صناعي، حكومي' } },
      { label: { en: 'Scope', ar: 'النطاق' }, value: { en: 'Interior, exterior, decorative, restoration', ar: 'داخلي، خارجي، زخرفي، ترميم' } },
    ],
    sections: [
      {
        heading: { en: 'Preparation decides the result', ar: 'التحضير يحدد النتيجة' },
        body: {
          en: 'Most paint failures are preparation failures. We wash down, make good, treat cracks and stabilise chalky or previously coated substrates before the first coat goes on, and we record the system used so a repaint years later can match it.',
          ar: 'معظم إخفاقات الدهان هي إخفاقات تحضير. نغسل السطح ونعالج العيوب والشقوق ونثبّت الأسطح المتفتتة أو المدهونة سابقاً قبل الطبقة الأولى، ونوثّق النظام المستخدم ليتيسر مطابقته عند إعادة الدهان بعد سنوات.',
        },
        images: [
          image('painter-applying-roller-coat', 'Painter applying a roller coat to an interior wall', 'دهّان يقوم بطلاء حائط داخلي بالرول'),
        ],
      },
      {
        heading: { en: 'Facades and high-level work', ar: 'الواجهات والعمل على ارتفاعات' },
        body: {
          en: 'Multi-storey facades are painted from suspended cradles and scaffolding with the access, permits and safety method statements handled as part of the package. We have completed government office buildings and staff accommodation on this basis.',
          ar: 'تُدهن واجهات المباني متعددة الطوابق من منصات معلّقة وسقالات، مع إدارة الوصول والتصاريح وبيانات طرق السلامة كجزء من الحزمة. وقد أنجزنا مباني مكاتب حكومية ومساكن للعاملين على هذا الأساس.',
        },
        images: [
          image('office-building-exterior-painting', 'Exterior painting from a suspended cradle', 'دهان خارجي من منصة معلقة'),
        ],
      },
    ],
    coverImage: img('painter-applying-roller-coat'),
    gallery: [
      image('painter-applying-roller-coat', 'Roller application on an interior wall', 'تنفيذ بالرول على حائط داخلي', 0),
      image('office-building-exterior-painting', 'Office building exterior painting', 'دهان خارجي لمبنى مكاتب', 1),
      image('villa-exterior-classical-finish', 'Classical villa facade finish', 'تشطيب واجهة فيلا كلاسيكية', 2),
      image('interior-hall-painting-works', 'Interior hall painting works', 'أعمال دهان قاعة داخلية', 3),
      image('interior-corridor-finish', 'Completed interior corridor', 'ممر داخلي مكتمل', 4),
      image('warehouse-exterior-coating', 'Warehouse exterior coating', 'طلاء خارجي لمستودع', 5),
    ],
    seo: {
      title: { en: 'Painting Contractors in the UAE — Art Colors', ar: 'مقاولو دهانات في الإمارات — Art Colors' },
      description: {
        en: 'Interior, exterior and decorative painting for residential, commercial and industrial projects across the UAE. Distributor and applicator for leading paint brands.',
        ar: 'دهانات داخلية وخارجية وزخرفية للمشاريع السكنية والتجارية والصناعية في الإمارات. موزّع ومنفّذ لعلامات دهانات رائدة.',
      },
    },
  },
  {
    slug: 'line-marking',
    order: 3,
    icon: 'circle-parking',
    name: { en: 'Line Marking & EV Parking Bays', ar: 'الخطوط الأرضية ومواقف السيارات الكهربائية' },
    excerpt: {
      en: 'Car park marking, EV charging bays, floor signage and lettering, executed to client and authority specifications.',
      ar: 'تخطيط المواقف، ومواقف شحن السيارات الكهربائية، واللافتات والكتابات الأرضية، وفق مواصفات العميل والجهات المعنية.',
    },
    description: {
      en: 'Electric-vehicle infrastructure has become a specialism of its own. We coat and mark EV charging bays, standard parking bays, lanes, walkways and loading areas, including the green bay coating, white borders, EV symbols and "Electric Vehicle Only" lettering that operators now require. Work at Ayla Hotel and Bawadi Mall was carried out under TAQA instructions, and we have delivered lane marking, bay numbering, signs and floor writing across RTA bus depots in Dubai.',
      ar: 'أصبحت البنية التحتية للسيارات الكهربائية تخصصاً قائماً بذاته. نُنفّذ طلاء وتخطيط مواقف الشحن الكهربائي والمواقف الاعتيادية والمسارات وممرات المشاة ومناطق التحميل، بما يشمل طلاء الموقف الأخضر والحدود البيضاء ورموز السيارات الكهربائية وكتابة «للسيارات الكهربائية فقط» التي يطلبها المشغّلون اليوم. وقد نُفِّذت أعمال فندق أيلا ومركز البوادي وفق تعليمات طاقة، كما أنجزنا خطوط المسارات وترقيم المواقف واللافتات والكتابات الأرضية في مستودعات حافلات هيئة الطرق والمواصلات بدبي.',
    },
    features: [
      { en: 'EV charging bay coating, symbols and lettering', ar: 'طلاء مواقف الشحن الكهربائي ورموزها وكتاباتها' },
      { en: 'Car park bay marking, numbering and directional arrows', ar: 'تخطيط المواقف وترقيمها وأسهم الاتجاه' },
      { en: 'Pedestrian walkways and hatched safety zones', ar: 'ممرات المشاة ومناطق السلامة المهشّرة' },
      { en: 'Lane marking for depots, yards and loading areas', ar: 'خطوط المسارات للمستودعات والساحات ومناطق التحميل' },
      { en: 'Floor signage, stencilled text and pictograms', ar: 'لافتات أرضية ونصوص بالإستنسل ورموز توضيحية' },
      { en: 'Work executed to authority and operator specifications', ar: 'تنفيذ وفق مواصفات الجهات والمشغّلين' },
      { en: 'Night and phased works to keep facilities open', ar: 'أعمال ليلية ومرحلية للحفاظ على استمرار عمل المرافق' },
    ],
    specs: [
      { label: { en: 'Specialism', ar: 'التخصص' }, value: { en: 'EV charging bays', ar: 'مواقف الشحن الكهربائي' } },
      { label: { en: 'Delivered under', ar: 'نُفِّذت وفق' }, value: { en: 'TAQA instructions', ar: 'تعليمات طاقة' } },
      { label: { en: 'Also covers', ar: 'يشمل أيضاً' }, value: { en: 'Depots, malls, hotels, warehouses', ar: 'مستودعات، مراكز تجارية، فنادق، مخازن' } },
      { label: { en: 'Includes', ar: 'يشمل' }, value: { en: 'Coating, marking, signage, lettering', ar: 'طلاء، تخطيط، لافتات، كتابات' } },
    ],
    sections: [
      {
        heading: { en: 'Built for operators', ar: 'مصمَّم للمشغّلين' },
        body: {
          en: 'Charging bays are inspected, photographed and audited. We set out to the operator standard, use coatings that survive tyre scuffing and hot-weather traffic, and protect the work until it is fully cured so the bay is not damaged on its first day of service.',
          ar: 'تُفحص مواقف الشحن وتُوثّق بالصور وتُراجع. نخطّط وفق معيار المشغّل، ونستخدم طلاءات تتحمل أثر الإطارات وحركة المرور في الحرارة العالية، ونحمي العمل حتى تمام جفافه حتى لا يتضرر الموقف في أول يوم تشغيل.',
        },
        images: [
          image('mall-ev-charging-bay', 'Mall EV bay marked ELECTRIC VEHICLE ONLY', 'موقف سيارات كهربائية في مركز تجاري مخصص للسيارات الكهربائية فقط'),
        ],
      },
    ],
    coverImage: img('mall-ev-charging-bay'),
    gallery: [
      image('mall-ev-charging-bay', 'EV bay with floor lettering', 'موقف كهربائي مع كتابة أرضية', 0),
      image('ev-parking-canopy-night', 'Shaded EV charging court at night', 'ساحة شحن مظللة ليلاً', 1),
      image('basement-ev-parking-court', 'Basement EV parking court', 'ساحة مواقف كهربائية في القبو', 2),
      image('ev-parking-epoxy-bays-daylight', 'EV bays in daylight', 'مواقف كهربائية في النهار', 3),
      image('ev-parking-epoxy-bays-sunset', 'EV bays at sunset', 'مواقف كهربائية عند الغروب', 4),
      image('mall-ev-charging-bay-wide', 'Wide view of mall EV bays', 'منظر واسع لمواقف كهربائية', 5),
    ],
    seo: {
      title: { en: 'EV Parking Bay & Car Park Line Marking — UAE', ar: 'تخطيط مواقف السيارات الكهربائية والمواقف — الإمارات' },
      description: {
        en: 'EV charging bay coating, car park line marking, floor signage and lettering across the UAE. Projects delivered under TAQA instructions.',
        ar: 'طلاء مواقف الشحن الكهربائي وتخطيط المواقف واللافتات والكتابات الأرضية في الإمارات. مشاريع نُفِّذت وفق تعليمات طاقة.',
      },
    },
  },
  {
    slug: 'waterproofing',
    order: 4,
    icon: 'shield-check',
    name: { en: 'Waterproofing', ar: 'العزل المائي' },
    excerpt: {
      en: 'Membrane and liquid-applied waterproofing for roofs, basements, wet areas, planters and water tanks.',
      ar: 'عزل مائي بالأغشية والأنظمة السائلة للأسطح والأقبية والمناطق الرطبة والمزارع والخزانات.',
    },
    description: {
      en: 'Waterproofing protects everything applied over it, so we treat it as structural rather than cosmetic. We install membrane and liquid-applied systems on roofs, basements, retaining walls, bathrooms and wet areas, planters and water tanks, with detailing at upstands, outlets, movement joints and penetrations given as much attention as the open field. Where an existing installation has failed, we investigate the cause before recommending a repair rather than simply coating over the symptom.',
      ar: 'يحمي العزل المائي كل ما يُنفَّذ فوقه، لذا نتعامل معه كعمل إنشائي لا تجميلي. نُنفّذ أنظمة الأغشية والأنظمة السائلة على الأسطح والأقبية والجدران الساندة والحمامات والمناطق الرطبة والمزارع وخزانات المياه، مع إيلاء تفاصيل الحواف والمصارف وفواصل الحركة والاختراقات العناية ذاتها التي تُولى للمسطحات المفتوحة. وحين تفشل منظومة قائمة، نبحث السبب قبل التوصية بالإصلاح، لا أن نطلي على العَرَض فحسب.',
    },
    features: [
      { en: 'Roof and podium waterproofing', ar: 'عزل الأسطح والمنصات' },
      { en: 'Basement and retaining wall systems', ar: 'أنظمة الأقبية والجدران الساندة' },
      { en: 'Bathrooms, kitchens and wet areas', ar: 'الحمامات والمطابخ والمناطق الرطبة' },
      { en: 'Planters, water features and tanks', ar: 'المزارع والنوافير والخزانات' },
      { en: 'Movement joint and penetration detailing', ar: 'تفاصيل فواصل الحركة والاختراقات' },
      { en: 'Leak investigation and remedial works', ar: 'تحقيق أسباب التسريب وأعمال المعالجة' },
    ],
    specs: [
      { label: { en: 'Systems', ar: 'الأنظمة' }, value: { en: 'Membrane and liquid-applied', ar: 'أغشية وأنظمة سائلة' } },
      { label: { en: 'Applications', ar: 'التطبيقات' }, value: { en: 'Roofs, basements, wet areas, tanks', ar: 'أسطح، أقبية، مناطق رطبة، خزانات' } },
      { label: { en: 'Also offered', ar: 'يُقدَّم أيضاً' }, value: { en: 'Leak investigation and repair', ar: 'تحقيق التسريبات وإصلاحها' } },
    ],
    sections: [],
    coverImage: img('warehouse-shutters-exterior'),
    gallery: [
      image('warehouse-shutters-exterior', 'Building envelope prepared for treatment', 'غلاف المبنى مُهيَّأ للمعالجة', 0),
      image('loading-bay-floor-marking', 'Loading bay protective coating', 'طلاء واقٍ لمنطقة تحميل', 1),
    ],
    seo: {
      title: { en: 'Waterproofing Contractors in the UAE', ar: 'مقاولو العزل المائي في الإمارات' },
      description: {
        en: 'Membrane and liquid-applied waterproofing for roofs, basements, wet areas and tanks across the UAE, including leak investigation and remedial works.',
        ar: 'عزل مائي بالأغشية والأنظمة السائلة للأسطح والأقبية والمناطق الرطبة والخزانات في الإمارات، بما يشمل تحقيق التسريبات وأعمال المعالجة.',
      },
    },
  },
  {
    slug: 'decorative-coatings',
    order: 5,
    icon: 'sparkles',
    name: { en: 'Decorative Materials & Micro Cement', ar: 'المواد الزخرفية والمايكرو سمنت' },
    excerpt: {
      en: 'Supply and application of decorative materials, micro cement and specialist textured finishes for feature surfaces.',
      ar: 'توريد وتنفيذ المواد الزخرفية والمايكرو سمنت والتشطيبات المميزة ذات الملمس للأسطح البارزة.',
    },
    description: {
      en: 'About ten years ago the group extended into the supply and application of decorative materials, and it has grown into a distinct line of work. We deliver micro cement, textured and metallic finishes, stone and travertine effects, and other specialist coatings for feature walls, reception areas, staircases, seamless floors and villa interiors. Because we both supply the material and apply it, sample panels can be prepared on site and signed off before the main area is committed.',
      ar: 'قبل نحو عشر سنوات توسّعت المجموعة في توريد وتنفيذ المواد الزخرفية، حتى صار ذلك خط عمل مستقلاً. نُنفّذ المايكرو سمنت والتشطيبات ذات الملمس والمعدنية وتأثيرات الحجر والترافرتين وطلاءات متخصصة أخرى للجدران البارزة ومناطق الاستقبال والسلالم والأرضيات بلا فواصل والتشطيبات الداخلية للفلل. ولأننا نورّد المادة وننفّذها، يمكن تحضير ألواح عيّنات في الموقع واعتمادها قبل الالتزام بالمسطح الرئيسي.',
    },
    features: [
      { en: 'Micro cement walls, floors and staircases', ar: 'مايكرو سمنت للجدران والأرضيات والسلالم' },
      { en: 'Textured, metallic and stone-effect finishes', ar: 'تشطيبات ذات ملمس ومعدنية وبتأثير الحجر' },
      { en: 'Feature walls and reception surfaces', ar: 'جدران بارزة وأسطح استقبال' },
      { en: 'Seamless, joint-free decorative floors', ar: 'أرضيات زخرفية بلا فواصل' },
      { en: 'On-site sample panels approved before full application', ar: 'ألواح عيّنات في الموقع تُعتمد قبل التنفيذ الكامل' },
      { en: 'Material supply to other contractors', ar: 'توريد المواد لمقاولين آخرين' },
    ],
    specs: [
      { label: { en: 'Since', ar: 'منذ' }, value: { en: 'Around 2015', ar: 'نحو عام 2015' } },
      { label: { en: 'Finishes', ar: 'التشطيبات' }, value: { en: 'Micro cement, textured, metallic, stone effect', ar: 'مايكرو سمنت، ملمسي، معدني، بتأثير الحجر' } },
      { label: { en: 'Model', ar: 'النموذج' }, value: { en: 'Supply and application', ar: 'توريد وتنفيذ' } },
    ],
    sections: [],
    coverImage: img('grc-decorative-wave-panel'),
    gallery: [
      image('grc-decorative-wave-panel', 'Three-dimensional decorative panel', 'لوح زخرفي ثلاثي الأبعاد', 0),
      image('interior-room-white-finish', 'Smooth interior surface finish', 'تشطيب سطح داخلي ناعم', 1),
      image('villa-exterior-classical-finish', 'Villa facade decorative finish', 'تشطيب زخرفي لواجهة فيلا', 2),
    ],
    seo: {
      title: { en: 'Micro Cement & Decorative Coatings — UAE', ar: 'المايكرو سمنت والطلاءات الزخرفية — الإمارات' },
      description: {
        en: 'Supply and application of micro cement, textured and metallic decorative finishes for feature walls, floors and villa interiors across the UAE.',
        ar: 'توريد وتنفيذ المايكرو سمنت والتشطيبات الزخرفية ذات الملمس والمعدنية للجدران والأرضيات والتشطيبات الداخلية للفلل في الإمارات.',
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projects = [
  {
    slug: 'rta-jebel-ali-bus-depot',
    order: 0,
    serviceSlug: 'epoxy-flooring',
    isFeatured: true,
    title: { en: 'RTA Jebel Ali Bus Depot', ar: 'مستودع حافلات جبل علي — هيئة الطرق والمواصلات' },
    client: { en: 'Roads and Transport Authority (RTA)', ar: 'هيئة الطرق والمواصلات' },
    location: { en: 'Jebel Ali, Dubai', ar: 'جبل علي، دبي' },
    area: '10,000 m²',
    year: null,
    excerpt: {
      en: '10,000 m² of epoxy flooring with full lane lining, signage and floor lettering — our largest single flooring contract to date.',
      ar: '10,000 متر مربع من أرضيات الإيبوكسي مع خطوط المسارات واللافتات والكتابات الأرضية — أكبر عقد أرضيات منفرد لنا حتى اليوم.',
    },
    description: {
      en: 'A working bus depot has to keep running while its floor is replaced. We delivered 10,000 m² of epoxy flooring across the depot in coordinated sections, with substrate preparation, epoxy application, lane lining, hatched safety zones, bay numbering, signage and floor writing completed area by area so that operations continued throughout. The finished floor takes daily bus traffic, workshop loads and wash-down cleaning.',
      ar: 'يجب أن يستمر عمل مستودع الحافلات أثناء استبدال أرضيته. نفّذنا 10,000 متر مربع من أرضيات الإيبوكسي في المستودع على مراحل منسّقة، مع تحضير الأرضية وتنفيذ الإيبوكسي وخطوط المسارات ومناطق السلامة المهشّرة وترقيم المواقف واللافتات والكتابات الأرضية، منطقة بعد أخرى، بما أتاح استمرار التشغيل. وتتحمل الأرضية المنجزة حركة الحافلات اليومية وأحمال الورش والتنظيف بالغسل.',
    },
    scope: [
      { en: 'Substrate preparation across 10,000 m²', ar: 'تحضير الأرضية على مساحة 10,000 م²' },
      { en: 'Epoxy floor coating', ar: 'طلاء أرضيات إيبوكسي' },
      { en: 'Lane lining and hatched safety zones', ar: 'خطوط المسارات ومناطق السلامة المهشّرة' },
      { en: 'Bay numbering, signs and floor writing', ar: 'ترقيم المواقف واللافتات والكتابات الأرضية' },
      { en: 'Phased execution to keep the depot operational', ar: 'تنفيذ مرحلي للحفاظ على تشغيل المستودع' },
    ],
    coverImage: img('bus-depot-epoxy-walkway'),
    gallery: [
      image('bus-depot-epoxy-walkway', 'Green epoxy walkway with yellow lining at the depot', 'ممر إيبوكسي أخضر مع خطوط صفراء في المستودع', 0),
      image('depot-floor-yellow-lining', 'Depot floor with fresh lane markings', 'أرضية المستودع بخطوط مسارات جديدة', 1),
    ],
  },
  {
    slug: 'rta-al-quoz-bus-depot',
    order: 1,
    serviceSlug: 'epoxy-flooring',
    isFeatured: true,
    title: { en: 'RTA Al Quoz Bus Depot', ar: 'مستودع حافلات القوز — هيئة الطرق والمواصلات' },
    client: { en: 'Roads and Transport Authority (RTA)', ar: 'هيئة الطرق والمواصلات' },
    location: { en: 'Al Quoz, Dubai', ar: 'القوز، دبي' },
    area: '6,000 m²',
    year: null,
    excerpt: {
      en: '6,000 m² of epoxy flooring, lining, signage and floor lettering in an operational workshop and depot environment.',
      ar: '6,000 متر مربع من أرضيات الإيبوكسي والخطوط واللافتات والكتابات الأرضية في بيئة ورشة ومستودع قيد التشغيل.',
    },
    description: {
      en: 'Following Jebel Ali, we carried out the same scope across 6,000 m² at the Al Quoz depot: preparation, epoxy coating, lane and bay marking, numbered service bays, signage and floor lettering. Workshop bays were handed back in sequence so the maintenance programme was never fully suspended.',
      ar: 'بعد جبل علي، نفّذنا النطاق ذاته على مساحة 6,000 متر مربع في مستودع القوز: التحضير وطلاء الإيبوكسي وتخطيط المسارات والمواقف وأخلجة الخدمة المرقّمة واللافتات والكتابات الأرضية. وأُعيد تسليم خلجان الورشة على التوالي بحيث لم يتوقف برنامج الصيانة كلياً في أي وقت.',
    },
    scope: [
      { en: 'Preparation and epoxy coating over 6,000 m²', ar: 'التحضير وطلاء الإيبوكسي على 6,000 م²' },
      { en: 'Numbered workshop service bays', ar: 'خلجان خدمة مرقّمة في الورشة' },
      { en: 'Lane lining and safety marking', ar: 'خطوط المسارات وعلامات السلامة' },
      { en: 'Signs and floor writing', ar: 'لافتات وكتابات أرضية' },
    ],
    coverImage: img('workshop-bay-line-marking'),
    gallery: [
      image('workshop-bay-line-marking', 'Numbered workshop service bay', 'خليج خدمة مرقّم في الورشة', 0),
      image('workshop-yellow-line-marking', 'Workshop floor with yellow safety marking', 'أرضية ورشة بعلامات أمان صفراء', 1),
    ],
  },
  {
    slug: 'ayla-hotel-ev-parking',
    order: 2,
    serviceSlug: 'line-marking',
    isFeatured: true,
    title: { en: 'Ayla Hotel EV Parking', ar: 'مواقف السيارات الكهربائية — فندق أيلا' },
    client: { en: 'Delivered under TAQA instructions', ar: 'نُفِّذ وفق تعليمات طاقة' },
    location: { en: 'Al Ain', ar: 'العين' },
    area: '',
    year: null,
    excerpt: {
      en: 'Electric-vehicle charging bays coated and marked to TAQA specification within a live hotel car park.',
      ar: 'مواقف شحن للسيارات الكهربائية طُليت وخُطّطت وفق مواصفات طاقة داخل موقف فندق قيد التشغيل.',
    },
    description: {
      en: 'Charging bays inside the hotel car park were prepared, coated in the specified green finish and marked with white borders, EV pictograms and directional detail, all under TAQA instructions. Work was sequenced around guest parking, and the bays were protected until fully cured before being released for use.',
      ar: 'جرى تحضير مواقف الشحن داخل موقف الفندق وطلاؤها بالتشطيب الأخضر المحدد وتخطيطها بحدود بيضاء ورموز السيارات الكهربائية وتفاصيل الاتجاه، وذلك كله وفق تعليمات طاقة. ونُظّم العمل حول مواقف الضيوف، وحُميت المواقف حتى تمام جفافها قبل إتاحتها للاستخدام.',
    },
    scope: [
      { en: 'Surface preparation of existing bays', ar: 'تحضير أسطح المواقف القائمة' },
      { en: 'Green EV bay coating to specification', ar: 'طلاء المواقف الكهربائية بالأخضر وفق المواصفة' },
      { en: 'White borders, EV pictograms and lettering', ar: 'حدود بيضاء ورموز وكتابات للسيارات الكهربائية' },
      { en: 'Works executed under TAQA instructions', ar: 'أعمال نُفِّذت وفق تعليمات طاقة' },
    ],
    coverImage: img('basement-ev-parking-court'),
    gallery: [
      image('basement-ev-parking-court', 'EV parking court with epoxy coating and markings', 'ساحة مواقف كهربائية بطلاء إيبوكسي وعلامات', 0),
      image('basement-ev-parking-bays', 'Freshly coated EV parking bays', 'مواقف كهربائية حديثة الطلاء', 1),
    ],
  },
  {
    slug: 'bawadi-mall-ev-parking',
    order: 3,
    serviceSlug: 'line-marking',
    isFeatured: true,
    title: { en: 'Bawadi Mall EV Parking', ar: 'مواقف السيارات الكهربائية — مركز البوادي' },
    client: { en: 'Delivered under TAQA instructions', ar: 'نُفِّذ وفق تعليمات طاقة' },
    location: { en: 'Al Ain', ar: 'العين' },
    area: '',
    year: null,
    excerpt: {
      en: 'Shaded outdoor EV charging court coated and marked to TAQA specification, executed around mall trading hours.',
      ar: 'ساحة شحن خارجية مظللة للسيارات الكهربائية طُليت وخُطّطت وفق مواصفات طاقة، ونُفِّذت حول ساعات عمل المركز.',
    },
    description: {
      en: 'The mall charging court is open to sun and rain and sees constant visitor traffic, so the coating had to be durable and the programme had to work around trading hours. Bays were prepared, coated and marked in phases including night working, with EV symbols and lettering applied to the operator standard.',
      ar: 'ساحة الشحن في المركز مكشوفة للشمس والمطر وتشهد حركة زوار متواصلة، لذا وجب أن يكون الطلاء متيناً وأن يتوافق البرنامج مع ساعات العمل التجاري. جرى تحضير المواقف وطلاؤها وتخطيطها على مراحل شملت العمل الليلي، مع تنفيذ رموز وكتابات السيارات الكهربائية وفق معيار المشغّل.',
    },
    scope: [
      { en: 'Phased and night working around trading hours', ar: 'عمل مرحلي وليلي حول ساعات العمل التجاري' },
      { en: 'EV bay coating and white bay borders', ar: 'طلاء المواقف الكهربائية وحدودها البيضاء' },
      { en: 'EV pictograms and floor lettering', ar: 'رموز السيارات الكهربائية والكتابات الأرضية' },
      { en: 'Works executed under TAQA instructions', ar: 'أعمال نُفِّذت وفق تعليمات طاقة' },
    ],
    coverImage: img('ev-parking-canopy-night'),
    gallery: [
      image('ev-parking-canopy-night', 'Shaded EV charging court at night', 'ساحة شحن مظللة ليلاً', 0),
      image('ev-parking-epoxy-bays-daylight', 'EV bays in daylight', 'المواقف الكهربائية في النهار', 1),
      image('ev-parking-epoxy-bays-sunset', 'EV bays at sunset', 'المواقف الكهربائية عند الغروب', 2),
    ],
  },
  {
    slug: 'rta-al-ruwayyah-office-building',
    order: 4,
    serviceSlug: 'painting',
    isFeatured: true,
    title: { en: 'RTA Al Ruwayyah Office Building', ar: 'مبنى مكاتب الرويّة — هيئة الطرق والمواصلات' },
    client: { en: 'Roads and Transport Authority (RTA)', ar: 'هيئة الطرق والمواصلات' },
    location: { en: 'Al Ruwayyah, Dubai', ar: 'الرويّة، دبي' },
    area: '',
    year: null,
    excerpt: {
      en: 'Exterior and interior painting of a multi-storey office building, executed from suspended cradles while the building stayed in use.',
      ar: 'دهانات خارجية وداخلية لمبنى مكاتب متعدد الطوابق، نُفِّذت من منصات معلّقة مع استمرار استخدام المبنى.',
    },
    description: {
      en: 'The facade was washed down, made good and repainted from suspended cradles, with crack treatment and substrate stabilisation carried out before coating. Interior areas — offices, corridors and stairs — were painted in phases agreed with the facilities team so departments could keep working. The same programme extended to RTA buildings and accommodation at Jebel Ali, Al Quoz and Al Qusais.',
      ar: 'جرى غسل الواجهة ومعالجة عيوبها وإعادة دهانها من منصات معلّقة، مع معالجة الشقوق وتثبيت الأسطح قبل الطلاء. ودُهنت المساحات الداخلية — المكاتب والممرات والسلالم — على مراحل مُتفق عليها مع فريق المرافق ليتمكن العاملون من متابعة أعمالهم. وامتد البرنامج ذاته إلى مباني ومساكن الهيئة في جبل علي والقوز والقصيص.',
    },
    scope: [
      { en: 'Facade wash-down, crack treatment and making good', ar: 'غسل الواجهة ومعالجة الشقوق وإصلاح العيوب' },
      { en: 'Exterior painting from suspended cradles', ar: 'دهان خارجي من منصات معلّقة' },
      { en: 'Interior painting of offices, corridors and stairs', ar: 'دهان داخلي للمكاتب والممرات والسلالم' },
      { en: 'Phased handover within an occupied building', ar: 'تسليم مرحلي داخل مبنى مأهول' },
    ],
    coverImage: img('office-building-exterior-painting'),
    gallery: [
      image('office-building-exterior-painting', 'Exterior painting from a suspended cradle', 'دهان خارجي من منصة معلقة', 0),
      image('rta-office-building-facade', 'Completed office building facade', 'واجهة مبنى المكاتب بعد الإنجاز', 1),
    ],
  },
  {
    slug: 'jumeirah-3-villa-exterior',
    order: 5,
    serviceSlug: 'painting',
    isFeatured: false,
    title: { en: 'Jumeirah 3 Villa Exterior', ar: 'واجهة فيلا في جميرا 3' },
    client: { en: 'Private client', ar: 'عميل خاص' },
    location: { en: 'Jumeirah 3, Dubai', ar: 'جميرا 3، دبي' },
    area: '',
    year: null,
    excerpt: {
      en: 'Exterior repainting of a classical villa facade, with cornices, columns and mouldings cut in by hand.',
      ar: 'إعادة دهان خارجي لواجهة فيلا كلاسيكية، مع تنفيذ الكرانيش والأعمدة والزخارف يدوياً.',
    },
    description: {
      en: 'Classical facades are mostly detail: cornices, arches, column capitals and window surrounds all need to be cut in cleanly and kept crisp. The villa was washed down, repaired where the render had cracked, then repainted in the agreed scheme with the mouldings picked out by hand.',
      ar: 'الواجهات الكلاسيكية تفاصيل في معظمها: الكرانيش والأقواس وتيجان الأعمدة وإطارات النوافذ تحتاج جميعها إلى تنفيذ نظيف وحدود حادة. جرى غسل الفيلا وإصلاح مواضع تشقق البلاستر، ثم أُعيد دهانها بالنظام المتفق عليه مع تنفيذ الزخارف يدوياً.',
    },
    scope: [
      { en: 'Facade wash-down and render repair', ar: 'غسل الواجهة وإصلاح البلاستر' },
      { en: 'Exterior repainting to the agreed scheme', ar: 'إعادة الدهان الخارجي وفق النظام المتفق عليه' },
      { en: 'Hand cutting-in of cornices, columns and surrounds', ar: 'تنفيذ يدوي للكرانيش والأعمدة والإطارات' },
    ],
    coverImage: img('villa-exterior-classical-finish'),
    gallery: [
      image('villa-exterior-classical-finish', 'Classical villa facade after repainting', 'واجهة فيلا كلاسيكية بعد إعادة الدهان', 0),
    ],
  },
  {
    slug: 'warehouse-exterior-painting',
    order: 6,
    serviceSlug: 'painting',
    isFeatured: false,
    title: { en: 'Warehouse Exterior Painting', ar: 'دهان خارجي لمستودع' },
    client: { en: 'Private client', ar: 'عميل خاص' },
    location: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    area: '2,000 m²',
    year: null,
    excerpt: {
      en: '2,000 m² of warehouse exterior painting, including roller shutters and service doors.',
      ar: '2,000 متر مربع من الدهان الخارجي لمستودع، بما يشمل الأبواب المتحركة وأبواب الخدمة.',
    },
    description: {
      en: 'A 2,000 m² warehouse envelope was prepared and coated with a protective exterior system, taking in cladding, blockwork, roller shutters and service doors. The specification was chosen for UV and dust exposure so the finish holds its colour in open industrial surroundings.',
      ar: 'جرى تحضير غلاف مستودع بمساحة 2,000 متر مربع وطلاؤه بنظام خارجي واقٍ، شمل الكسوة والبلوك والأبواب المتحركة وأبواب الخدمة. واختيرت المواصفة لمقاومة الأشعة فوق البنفسجية والغبار بحيث يحافظ التشطيب على لونه في محيط صناعي مكشوف.',
    },
    scope: [
      { en: 'Preparation of 2,000 m² of exterior envelope', ar: 'تحضير 2,000 م² من الغلاف الخارجي' },
      { en: 'Protective exterior coating system', ar: 'نظام طلاء خارجي واقٍ' },
      { en: 'Roller shutters and service doors', ar: 'الأبواب المتحركة وأبواب الخدمة' },
    ],
    coverImage: img('warehouse-exterior-coating'),
    gallery: [
      image('warehouse-exterior-coating', 'Warehouse exterior after coating', 'المستودع من الخارج بعد الطلاء', 0),
      image('warehouse-shutters-exterior', 'Warehouse facade and roller shutters', 'واجهة المستودع والأبواب المتحركة', 1),
    ],
  },
  {
    slug: 'rta-accommodation-interior',
    order: 7,
    serviceSlug: 'painting',
    isFeatured: false,
    title: { en: 'RTA Accommodation Interior Finishing', ar: 'تشطيبات داخلية لمساكن هيئة الطرق والمواصلات' },
    client: { en: 'Roads and Transport Authority (RTA)', ar: 'هيئة الطرق والمواصلات' },
    location: { en: 'Dubai', ar: 'دبي' },
    area: '',
    year: null,
    excerpt: {
      en: 'Interior painting and finishing of staff accommodation rooms, corridors and common areas.',
      ar: 'دهانات وتشطيبات داخلية لغرف مساكن العاملين والممرات والمناطق المشتركة.',
    },
    description: {
      en: 'Accommodation blocks were finished room by room: walls made good, ceilings and corridors painted, and rooms cleaned and handed over in sequence so occupancy could continue in the rest of the building. Light-reflective white finishes were used throughout to keep the interiors bright.',
      ar: 'أُنجزت مباني المساكن غرفة بغرفة: إصلاح الجدران، ودهان الأسقف والممرات، وتنظيف الغرف وتسليمها على التوالي بحيث يستمر السكن في بقية المبنى. واستُخدمت تشطيبات بيضاء عاكسة للضوء في كل المساحات للحفاظ على إشراق الداخل.',
    },
    scope: [
      { en: 'Making good of walls and ceilings', ar: 'إصلاح الجدران والأسقف' },
      { en: 'Interior painting of rooms and corridors', ar: 'دهان داخلي للغرف والممرات' },
      { en: 'Room-by-room sequencing and handover', ar: 'تنفيذ وتسليم غرفة بغرفة' },
    ],
    coverImage: img('interior-corridor-finish'),
    gallery: [
      image('interior-corridor-finish', 'Completed corridor with white finish', 'ممر مكتمل بتشطيب أبيض', 0),
      image('interior-room-white-finish', 'Room handed over with smooth white walls', 'غرفة مُسلَّمة بجدران بيضاء ناعمة', 1),
    ],
  },
  {
    slug: 'mall-basement-ev-bays',
    order: 8,
    serviceSlug: 'line-marking',
    isFeatured: false,
    title: { en: 'Mall Basement EV Charging Bays', ar: 'مواقف شحن كهربائية في قبو مركز تجاري' },
    client: { en: 'Mall operator', ar: 'مشغّل مركز تجاري' },
    location: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    area: '',
    year: null,
    excerpt: {
      en: 'Basement charging bays coated in green epoxy with EV pictograms and "Electric Vehicle Only" floor lettering.',
      ar: 'مواقف شحن في القبو طُليت بإيبوكسي أخضر مع رموز السيارات الكهربائية وكتابة «للسيارات الكهربائية فقط» على الأرضية.',
    },
    description: {
      en: 'Bays adjacent to the chargers were coated in green epoxy, edged in white and stencilled with the EV pictogram and "Electric Vehicle Only" text. Working in an occupied basement meant tight ventilation control, protection of adjacent parking and a handover schedule that matched the mall opening hours.',
      ar: 'طُليت المواقف المجاورة لأجهزة الشحن بإيبوكسي أخضر وحُدِّدت بالأبيض ونُفِّذ عليها رمز السيارة الكهربائية ونص «للسيارات الكهربائية فقط» بالإستنسل. والعمل في قبو مأهول استلزم تحكماً دقيقاً في التهوية وحماية المواقف المجاورة وجدولاً للتسليم يتوافق مع ساعات عمل المركز.',
    },
    scope: [
      { en: 'Green epoxy bay coating and white edging', ar: 'طلاء المواقف بالإيبوكسي الأخضر وتحديدها بالأبيض' },
      { en: 'EV pictograms and floor lettering', ar: 'رموز السيارات الكهربائية والكتابات الأرضية' },
      { en: 'Ventilation control and protection of adjacent parking', ar: 'التحكم في التهوية وحماية المواقف المجاورة' },
    ],
    coverImage: img('mall-ev-charging-bay'),
    gallery: [
      image('mall-ev-charging-bay', 'EV bay with floor lettering', 'موقف كهربائي مع كتابة أرضية', 0),
      image('mall-ev-charging-bay-wide', 'Wide view of the charging bays', 'منظر واسع لمواقف الشحن', 1),
    ],
  },
  {
    slug: 'rta-al-qusais-depot-coating',
    order: 9,
    serviceSlug: 'epoxy-flooring',
    isFeatured: false,
    title: { en: 'RTA Al Qusais Depot Coating & Marking', ar: 'طلاء وتخطيط مستودع القصيص — هيئة الطرق والمواصلات' },
    client: { en: 'Roads and Transport Authority (RTA)', ar: 'هيئة الطرق والمواصلات' },
    location: { en: 'Al Qusais, Dubai', ar: 'القصيص، دبي' },
    area: '',
    year: null,
    excerpt: {
      en: 'Floor coating, loading-bay treatment and safety marking within an operational transport depot.',
      ar: 'طلاء أرضيات ومعالجة منطقة التحميل وعلامات السلامة داخل مستودع نقل قيد التشغيل.',
    },
    description: {
      en: 'Hall floors and loading areas were prepared and coated, then marked with lanes, walkways and hatched exclusion zones. Materials were selected for forklift and pallet traffic, and areas were released back to operations in sequence.',
      ar: 'جرى تحضير أرضيات القاعات ومناطق التحميل وطلاؤها، ثم تخطيطها بالمسارات وممرات المشاة ومناطق المنع المهشّرة. واختيرت المواد لتتحمل حركة الرافعات الشوكية والمنصات، وأُعيدت المناطق إلى التشغيل على التوالي.',
    },
    scope: [
      { en: 'Hall and loading-area floor coating', ar: 'طلاء أرضيات القاعات ومناطق التحميل' },
      { en: 'Lane, walkway and exclusion-zone marking', ar: 'تخطيط المسارات وممرات المشاة ومناطق المنع' },
      { en: 'Materials selected for forklift traffic', ar: 'مواد مختارة لتحمل حركة الرافعات الشوكية' },
    ],
    coverImage: img('warehouse-polished-floor'),
    gallery: [
      image('warehouse-polished-floor', 'Warehouse hall floor after coating', 'أرضية قاعة المستودع بعد الطلاء', 0),
      image('loading-bay-floor-marking', 'Loading bay with floor marking', 'منطقة تحميل بعلامات أرضية', 1),
    ],
  },
];

// ---------------------------------------------------------------------------
// Gallery albums
// ---------------------------------------------------------------------------

export const albums = [
  {
    slug: 'flooring-works',
    order: 0,
    title: { en: 'Flooring & Epoxy Works', ar: 'أعمال الأرضيات والإيبوكسي' },
    description: {
      en: 'Epoxy, polyurethane and seamless floors in depots, warehouses and workshops.',
      ar: 'أرضيات إيبوكسي وبولي يوريثان وأرضيات بلا فواصل في المستودعات والمخازن والورش.',
    },
    coverImage: img('bus-depot-epoxy-walkway'),
    images: [
      image('bus-depot-epoxy-walkway', 'Green epoxy walkway with yellow lining', 'ممر إيبوكسي أخضر مع خطوط صفراء', 0),
      image('depot-floor-yellow-lining', 'Depot floor lane marking', 'خطوط مسارات في أرضية المستودع', 1),
      image('workshop-bay-line-marking', 'Numbered workshop service bay', 'خليج خدمة مرقّم في الورشة', 2),
      image('warehouse-polished-floor', 'Warehouse hall floor', 'أرضية قاعة مستودع', 3),
      image('workshop-yellow-line-marking', 'Industrial safety line marking', 'خطوط أمان صناعية', 4),
      image('service-corridor-green-epoxy', 'Service corridor in green epoxy', 'ممر خدمي بإيبوكسي أخضر', 5),
      image('loading-bay-floor-marking', 'Loading bay floor marking', 'علامات أرضية في منطقة التحميل', 6),
    ],
  },
  {
    slug: 'ev-parking-bays',
    order: 1,
    title: { en: 'EV Parking & Line Marking', ar: 'مواقف السيارات الكهربائية والخطوط الأرضية' },
    description: {
      en: 'Electric-vehicle charging bays, floor pictograms and car park marking.',
      ar: 'مواقف شحن السيارات الكهربائية والرموز الأرضية وتخطيط المواقف.',
    },
    coverImage: img('mall-ev-charging-bay'),
    images: [
      image('mall-ev-charging-bay', 'EV bay with floor lettering', 'موقف كهربائي مع كتابة أرضية', 0),
      image('mall-ev-charging-bay-wide', 'Wide view of mall EV bays', 'منظر واسع لمواقف كهربائية', 1),
      image('ev-parking-canopy-night', 'Shaded charging court at night', 'ساحة شحن مظللة ليلاً', 2),
      image('ev-parking-epoxy-bays-daylight', 'EV bays in daylight', 'مواقف كهربائية في النهار', 3),
      image('ev-parking-epoxy-bays-sunset', 'EV bays at sunset', 'مواقف كهربائية عند الغروب', 4),
      image('basement-ev-parking-court', 'Basement EV parking court', 'ساحة مواقف كهربائية في القبو', 5),
      image('basement-ev-parking-bays', 'Freshly coated basement bays', 'مواقف حديثة الطلاء في القبو', 6),
    ],
  },
  {
    slug: 'painting-works',
    order: 2,
    title: { en: 'Painting Projects', ar: 'مشاريع الدهانات' },
    description: {
      en: 'Interior and exterior painting for government, commercial and residential buildings.',
      ar: 'دهانات داخلية وخارجية لمبانٍ حكومية وتجارية وسكنية.',
    },
    coverImage: img('painter-applying-roller-coat'),
    images: [
      image('painter-applying-roller-coat', 'Roller application on an interior wall', 'تنفيذ بالرول على حائط داخلي', 0),
      image('office-building-exterior-painting', 'Office building exterior painting', 'دهان خارجي لمبنى مكاتب', 1),
      image('rta-office-building-facade', 'Completed office facade', 'واجهة مكاتب مكتملة', 2),
      image('villa-exterior-classical-finish', 'Classical villa facade', 'واجهة فيلا كلاسيكية', 3),
      image('interior-hall-painting-works', 'Interior hall painting works', 'أعمال دهان قاعة داخلية', 4),
      image('interior-corridor-finish', 'Completed interior corridor', 'ممر داخلي مكتمل', 5),
      image('interior-room-white-finish', 'Room with smooth white finish', 'غرفة بتشطيب أبيض ناعم', 6),
      image('warehouse-exterior-coating', 'Warehouse exterior coating', 'طلاء خارجي لمستودع', 7),
      image('warehouse-shutters-exterior', 'Warehouse facade and shutters', 'واجهة مستودع وأبواب متحركة', 8),
    ],
  },
  {
    slug: 'gypsum-grc-works',
    order: 3,
    title: { en: 'Gypsum & GRC', ar: 'الجبس والـ GRC' },
    description: {
      en: 'Gypsum ceilings, GRC panels and decorative elements from our own moulds.',
      ar: 'أسقف جبسية وألواح GRC وعناصر زخرفية من قوالبنا الخاصة.',
    },
    coverImage: img('gypsum-ceiling-installation'),
    images: [
      image('gypsum-ceiling-installation', 'Gypsum ceiling installation', 'تركيب سقف جبسي', 0),
      image('grc-decorative-wave-panel', 'Decorative GRC wave panel', 'لوح GRC مموج زخرفي', 1),
    ],
  },
];

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

export const faqs = [
  {
    order: 0,
    question: { en: 'Which emirates do you work in?', ar: 'في أي إمارات تعملون؟' },
    answer: {
      en: 'We operate across Abu Dhabi, Dubai, Al Ain and Ajman, with our head office and gypsum factory in Al Ain. Projects elsewhere in the UAE can usually be accommodated — ask us when you request a quotation.',
      ar: 'نعمل في أبوظبي ودبي والعين وعجمان، ومكتبنا الرئيسي ومصنع الجبس في العين. وغالباً ما يمكننا تنفيذ مشاريع في مناطق أخرى من الإمارات — اسألنا عند طلب عرض السعر.',
    },
  },
  {
    order: 1,
    question: { en: 'Do you handle both supply and installation?', ar: 'هل تتولون التوريد والتركيب معاً؟' },
    answer: {
      en: 'Yes. We manufacture gypsum and GRC in our own factory and install it with our own teams, and for paints we act as both distributor and applicator under the name Art Colors. Keeping supply and application together means one party is responsible for the specification, the workmanship and the result.',
      ar: 'نعم. نُصنّع الجبس والـ GRC في مصنعنا ونُركّبه بفرقنا، وفي الدهانات نعمل كموزّع ومنفّذ تحت اسم Art Colors. والجمع بين التوريد والتنفيذ يعني أن جهة واحدة مسؤولة عن المواصفة وجودة العمل والنتيجة.',
    },
  },
  {
    order: 2,
    question: { en: 'How do I get a quotation?', ar: 'كيف أحصل على عرض سعر؟' },
    answer: {
      en: 'Send us your requirement through the quote request form, by WhatsApp or by phone. For anything beyond a small job we prefer to visit the site first, because the substrate usually decides the specification and therefore the price.',
      ar: 'أرسل لنا متطلبك عبر نموذج طلب عرض السعر أو واتساب أو الهاتف. ولأي عمل يتجاوز النطاق الصغير نفضّل زيارة الموقع أولاً، لأن حالة السطح القائم هي التي تحدد المواصفة وبالتالي السعر.',
    },
  },
  {
    order: 3,
    question: { en: 'Can you work in an occupied or operating building?', ar: 'هل يمكنكم العمل في مبنى مأهول أو قيد التشغيل؟' },
    answer: {
      en: 'Most of our work is done this way. Bus depots, malls, hotels and office buildings all stayed in service while we worked, using phased areas, night shifts and sequenced handover so that operations were never fully suspended.',
      ar: 'معظم أعمالنا تُنفَّذ بهذه الطريقة. فمستودعات الحافلات والمراكز التجارية والفنادق ومباني المكاتب بقيت جميعها قيد الخدمة أثناء عملنا، باستخدام التنفيذ المرحلي والورديات الليلية والتسليم المتتالي بحيث لم يتوقف التشغيل كلياً في أي وقت.',
    },
  },
  {
    order: 4,
    question: { en: 'How many gypsum designs can I choose from?', ar: 'كم عدد تصاميم الجبس المتاحة للاختيار؟' },
    answer: {
      en: 'Our mould library holds more than 2,500 designs across Moroccan, Islamic, modern and classical styles. If nothing matches, we can produce a custom mould from your drawing.',
      ar: 'تضم مكتبة قوالبنا أكثر من 2,500 تصميم تشمل الطرز المغربية والإسلامية والحديثة والكلاسيكية. وإن لم يوجد ما يطابق مطلبك، يمكننا إنتاج قالب مخصّص من مخططك.',
    },
  },
  {
    order: 5,
    question: { en: 'Which flooring system will I need?', ar: 'أي نظام أرضيات سأحتاج؟' },
    answer: {
      en: 'It depends on the loads, the cleaning regime and any chemical exposure. Epoxy suits most warehouses and car parks, polyurethane handles thermal movement and chemical attack, and micro cement is chosen where the floor is also a finish. We advise after surveying the substrate and confirming moisture levels.',
      ar: 'يعتمد ذلك على الأحمال ونظام التنظيف وأي تعرض كيميائي. الإيبوكسي يناسب معظم المستودعات والمواقف، والبولي يوريثان يتحمل الحركة الحرارية والهجوم الكيميائي، ويُختار المايكرو سمنت حين تكون الأرضية تشطيباً في ذاتها. ونقدّم توصيتنا بعد فحص الأرضية والتحقق من مستويات الرطوبة.',
    },
  },
  {
    order: 6,
    question: { en: 'Do you take on government and authority projects?', ar: 'هل تنفّذون مشاريع حكومية وللجهات الرسمية؟' },
    answer: {
      en: 'Yes, and we have done since 1986. Recent examples include bus depots and office buildings for the Roads and Transport Authority in Dubai, and EV charging bays delivered under TAQA instructions in Al Ain.',
      ar: 'نعم، ومنذ عام 1986. وتشمل الأمثلة الحديثة مستودعات حافلات ومباني مكاتب لهيئة الطرق والمواصلات في دبي، ومواقف شحن للسيارات الكهربائية نُفِّذت وفق تعليمات طاقة في العين.',
    },
  },
  {
    order: 7,
    question: { en: 'How long has Al-Sharqiya been established?', ar: 'منذ متى تأسست الشرقية؟' },
    answer: {
      en: 'The company was established in 1986 in Al Ain, making gypsum and GRC products, and later expanded to Abu Dhabi, Dubai and Ajman. The paints and flooring side of the business, Art Colors, was added roughly ten years ago.',
      ar: 'تأسست الشركة عام 1986 في العين لتصنيع منتجات الجبس والـ GRC، ثم توسّعت إلى أبوظبي ودبي وعجمان. وأُضيف نشاط الدهانات والأرضيات، Art Colors، قبل نحو عشر سنوات.',
    },
  },
];

// ---------------------------------------------------------------------------
// Static pages
// ---------------------------------------------------------------------------

export const pages = [
  {
    slug: 'privacy',
    order: 0,
    title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    sections: [
      {
        heading: { en: 'What we collect', ar: 'ما نجمعه' },
        body: {
          en: 'When you send a quote request or a contact message we collect the name, phone number, email address and project details you choose to give us. We do not collect payment information through this website.',
          ar: 'عند إرسالك طلب عرض سعر أو رسالة تواصل، نجمع الاسم ورقم الهاتف والبريد الإلكتروني وتفاصيل المشروع التي تختار تزويدنا بها. ولا نجمع أي بيانات دفع عبر هذا الموقع.',
        },
      },
      {
        heading: { en: 'How we use it', ar: 'كيف نستخدمها' },
        body: {
          en: 'Your details are used only to respond to your enquiry, prepare a quotation and carry out any work you award us. We do not sell or rent personal data to third parties.',
          ar: 'تُستخدم بياناتك فقط للرد على استفسارك وإعداد عرض السعر وتنفيذ أي أعمال تُوكل إلينا. ولا نبيع البيانات الشخصية أو نؤجّرها لأي طرف ثالث.',
        },
      },
      {
        heading: { en: 'Retention and your rights', ar: 'الاحتفاظ بالبيانات وحقوقك' },
        body: {
          en: 'Enquiry records are kept as long as needed for our business and legal obligations. You may ask us to correct or delete your details at any time by writing to alsharqiagypsum@gmail.com.',
          ar: 'يُحتفظ بسجلات الاستفسارات طالما لزم ذلك لأعمالنا والتزاماتنا القانونية. ويمكنك في أي وقت مطالبتنا بتصحيح بياناتك أو حذفها بالكتابة إلى alsharqiagypsum@gmail.com.',
        },
      },
      {
        heading: { en: 'Cookies', ar: 'ملفات تعريف الارتباط' },
        body: {
          en: 'This website uses only the cookies required for it to function and to remember your language choice. No advertising or cross-site tracking cookies are set.',
          ar: 'يستخدم هذا الموقع ملفات تعريف الارتباط اللازمة لعمله وتذكّر اختيارك للغة فقط. ولا تُستخدم ملفات إعلانية أو للتتبع بين المواقع.',
        },
      },
    ],
  },
  {
    slug: 'terms',
    order: 1,
    title: { en: 'Terms of Use', ar: 'شروط الاستخدام' },
    sections: [
      {
        heading: { en: 'About this website', ar: 'عن هذا الموقع' },
        body: {
          en: 'This website is published by Al-Sharqiya Gypsum & GRC Group, United Arab Emirates. It describes our services and completed projects for information purposes.',
          ar: 'يُنشر هذا الموقع من قِبل مجموعة الشرقية للجبس والـ GRC، الإمارات العربية المتحدة. ويعرض خدماتنا ومشاريعنا المنجزة لأغراض المعلومات.',
        },
      },
      {
        heading: { en: 'Quotations are not prices', ar: 'المعلومات ليست عروض أسعار' },
        body: {
          en: 'Nothing on this website is a binding offer. Areas, quantities and descriptions of past projects are indicative. A price becomes binding only in a written quotation issued and signed by us.',
          ar: 'لا يُعدّ أي مما ورد في هذا الموقع عرضاً مُلزماً. والمساحات والكميات وأوصاف المشاريع السابقة استرشادية. ولا يصبح السعر مُلزماً إلا في عرض سعر مكتوب صادر وموقّع منا.',
        },
      },
      {
        heading: { en: 'Images and content', ar: 'الصور والمحتوى' },
        body: {
          en: 'Project photographs, text and the Al-Sharqiya logo are our property or are used with permission, and may not be reproduced without written consent.',
          ar: 'صور المشاريع والنصوص وشعار الشرقية ملك لنا أو مستخدمة بإذن، ولا يجوز إعادة إنتاجها دون موافقة كتابية.',
        },
      },
      {
        heading: { en: 'Governing law', ar: 'القانون الحاكم' },
        body: {
          en: 'These terms are governed by the laws of the United Arab Emirates.',
          ar: 'تخضع هذه الشروط لقوانين الإمارات العربية المتحدة.',
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navigation = {
  headerMenu: [
    { key: 'home', label: { en: 'Home', ar: 'الرئيسية' }, href: '/', order: 0, hidden: false },
    { key: 'services', label: { en: 'Services', ar: 'خدماتنا' }, href: '/services', order: 1, hidden: false },
    { key: 'projects', label: { en: 'Projects', ar: 'مشاريعنا' }, href: '/projects', order: 2, hidden: false },
    { key: 'gallery', label: { en: 'Gallery', ar: 'معرض الصور' }, href: '/gallery', order: 3, hidden: false },
    { key: 'about', label: { en: 'About', ar: 'من نحن' }, href: '/about', order: 4, hidden: false },
    { key: 'contact', label: { en: 'Contact', ar: 'اتصل بنا' }, href: '/contact', order: 5, hidden: false },
  ],
  footerMenu: [
    { key: 'services', label: { en: 'Services', ar: 'خدماتنا' }, href: '/services', order: 0, hidden: false },
    { key: 'projects', label: { en: 'Projects', ar: 'مشاريعنا' }, href: '/projects', order: 1, hidden: false },
    { key: 'gallery', label: { en: 'Gallery', ar: 'معرض الصور' }, href: '/gallery', order: 2, hidden: false },
    { key: 'about', label: { en: 'About us', ar: 'من نحن' }, href: '/about', order: 3, hidden: false },
    { key: 'faq', label: { en: 'FAQ', ar: 'الأسئلة الشائعة' }, href: '/faq', order: 4, hidden: false },
    { key: 'quote', label: { en: 'Request a quote', ar: 'طلب عرض سعر' }, href: '/quote', order: 5, hidden: false },
  ],
  legalMenu: [
    { key: 'privacy', label: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' }, href: '/privacy', order: 0, hidden: false },
    { key: 'terms', label: { en: 'Terms of Use', ar: 'شروط الاستخدام' }, href: '/terms', order: 1, hidden: false },
  ],
};

// ---------------------------------------------------------------------------
// Homepage content
// ---------------------------------------------------------------------------

export const homepage = {
  hero: {
    eyebrow: { en: 'Since 1986 · United Arab Emirates', ar: 'منذ 1986 · الإمارات العربية المتحدة' },
    titleLine1: { en: 'Four decades of', ar: 'أربعة عقود من' },
    titleLine2: { en: 'finishing the UAE', ar: 'تشطيبات الإمارات' },
    subtitle: {
      en: 'Gypsum and GRC manufacturing, epoxy flooring, painting and waterproofing — supplied and applied by our own teams across Abu Dhabi, Dubai, Al Ain and Ajman.',
      ar: 'صناعة الجبس والـ GRC، وأرضيات الإيبوكسي، والدهانات، والعزل المائي — نورّدها وننفّذها بفرقنا في أبوظبي ودبي والعين وعجمان.',
    },
    primaryCta: { en: 'Request a quote', ar: 'اطلب عرض سعر' },
    secondaryCta: { en: 'View our projects', ar: 'شاهد مشاريعنا' },
    slides: [
      img('bus-depot-epoxy-walkway'),
      img('mall-ev-charging-bay'),
      img('gypsum-ceiling-installation'),
      img('office-building-exterior-painting'),
      img('ev-parking-canopy-night'),
    ],
  },
  intro: {
    heading: { en: 'One contractor, from the mould to the final coat', ar: 'مقاول واحد، من القالب إلى الطبقة الأخيرة' },
    body: {
      en: 'Al-Sharqiya was established in 1986 in Al Ain as a manufacturer of gypsum and GRC products, and grew into a group covering flooring, painting, waterproofing and decorative finishes. We manufacture what we install and we apply what we supply, which is why government authorities and private clients have kept coming back for forty years.',
      ar: 'تأسست الشرقية عام 1986 في العين كمُصنّع لمنتجات الجبس والـ GRC، ثم نمت لتصبح مجموعة تغطي الأرضيات والدهانات والعزل المائي والتشطيبات الزخرفية. نُصنّع ما نُركّبه ونُنفّذ ما نورّده، ولهذا واصلت الجهات الحكومية والعملاء من القطاع الخاص العودة إلينا على مدى أربعين عاماً.',
    },
  },
  stats: [
    { value: '1986', label: { en: 'Established', ar: 'سنة التأسيس' } },
    { value: '2,500+', label: { en: 'Gypsum mould designs', ar: 'تصميم قالب جبس' } },
    { value: '4', label: { en: 'Emirates covered', ar: 'إمارات نغطيها' } },
    { value: '10,000 m²', label: { en: 'Largest single epoxy contract', ar: 'أكبر عقد إيبوكسي منفرد' } },
  ],
  values: [
    {
      icon: 'factory',
      title: { en: 'We make it ourselves', ar: 'نُصنّعه بأنفسنا' },
      body: {
        en: 'Our own factory and mould library mean profiles, thicknesses and lead times are under our control, not a supplier’s.',
        ar: 'مصنعنا ومكتبة قوالبنا يعنيان أن المقاطع والسماكات ومدد التنفيذ تحت سيطرتنا لا سيطرة مورّد.',
      },
    },
    {
      icon: 'badge-check',
      title: { en: 'Supply and application together', ar: 'التوريد والتنفيذ معاً' },
      body: {
        en: 'As distributor and applicator we carry the specification and the workmanship, so there is nobody to point at if a finish fails.',
        ar: 'كموزّع ومنفّذ نتحمل المواصفة وجودة العمل، فلا يوجد طرف آخر يُلام إذا فشل التشطيب.',
      },
    },
    {
      icon: 'landmark',
      title: { en: 'Government-grade delivery', ar: 'تنفيذ بمستوى المشاريع الحكومية' },
      body: {
        en: 'Authority projects come with permits, method statements and inspections. We have worked to that standard since 1986.',
        ar: 'تأتي المشاريع الحكومية بتصاريح وبيانات طرق وتفتيش. وقد عملنا بهذا المستوى منذ 1986.',
      },
    },
    {
      icon: 'clock',
      title: { en: 'Work around your operations', ar: 'نعمل حول تشغيلكم' },
      body: {
        en: 'Phased areas, night shifts and sequenced handover keep depots, malls and offices running while we work.',
        ar: 'التنفيذ المرحلي والورديات الليلية والتسليم المتتالي تُبقي المستودعات والمراكز والمكاتب تعمل أثناء تنفيذنا.',
      },
    },
    {
      icon: 'ruler',
      title: { en: 'Specified for real conditions', ar: 'مواصفات لظروف حقيقية' },
      body: {
        en: 'We survey the substrate and check moisture before proposing a system, because UAE heat and dust punish shortcuts.',
        ar: 'نفحص السطح القائم ونتحقق من الرطوبة قبل اقتراح النظام، لأن حرارة الإمارات وغبارها لا يرحمان الحلول المتعجّلة.',
      },
    },
    {
      icon: 'map-pin',
      title: { en: 'Four emirates, one team', ar: 'أربع إمارات وفريق واحد' },
      body: {
        en: 'Branches in Abu Dhabi, Dubai, Al Ain and Ajman put a crew and a supervisor within reach of your site.',
        ar: 'فروعنا في أبوظبي ودبي والعين وعجمان تجعل الفريق والمشرف قريبين من موقعكم.',
      },
    },
  ],
  process: [
    {
      title: { en: 'Site survey', ar: 'زيارة الموقع' },
      body: {
        en: 'We visit, measure and test the substrate — moisture, soundness and existing coatings all change the specification.',
        ar: 'نزور الموقع ونقيس ونفحص السطح القائم — فالرطوبة والسلامة والطلاءات الحالية تُغيّر المواصفة.',
      },
    },
    {
      title: { en: 'Specification & quotation', ar: 'المواصفة وعرض السعر' },
      body: {
        en: 'You receive a written system, build-up and programme with the price, plus sample panels where the finish matters.',
        ar: 'تحصل على نظام مكتوب وسماكات وبرنامج زمني مع السعر، إضافة إلى ألواح عيّنات حيث يكون التشطيب حاسماً.',
      },
    },
    {
      title: { en: 'Execution', ar: 'التنفيذ' },
      body: {
        en: 'Our own crews carry out preparation, application and marking under a supervisor, in phases that suit your operations.',
        ar: 'تُنفّذ فرقنا التحضير والتطبيق والتخطيط بإشراف مشرف، على مراحل تناسب تشغيلكم.',
      },
    },
    {
      title: { en: 'Handover & aftercare', ar: 'التسليم والمتابعة' },
      body: {
        en: 'We protect the work until it cures, hand over clean, and record the system used so future repairs can match it.',
        ar: 'نحمي العمل حتى تمام جفافه، ونُسلّم نظيفاً، ونوثّق النظام المستخدم لتتيسر مطابقته في أي إصلاح مستقبلي.',
      },
    },
  ],
  clients: {
    heading: { en: 'Delivered for', ar: 'نفّذنا لصالح' },
    note: {
      en: 'Selected clients and project references from our company profile.',
      ar: 'عملاء ومراجع مشاريع مختارة من ملف الشركة.',
    },
    items: [
      { en: 'Roads and Transport Authority (RTA)', ar: 'هيئة الطرق والمواصلات' },
      { en: 'TAQA', ar: 'طاقة' },
      { en: 'Ayla Hotel', ar: 'فندق أيلا' },
      { en: 'Bawadi Mall', ar: 'مركز البوادي' },
    ],
  },
  cta: {
    heading: { en: 'Tell us about your project', ar: 'حدّثنا عن مشروعك' },
    body: {
      en: 'Send the drawings, the area or just a photo of the floor. We will tell you what system it needs and what it will cost.',
      ar: 'أرسل المخططات أو المساحة أو حتى صورة للأرضية. وسنخبرك بالنظام المطلوب وبالتكلفة.',
    },
    primaryCta: { en: 'Request a quote', ar: 'اطلب عرض سعر' },
    secondaryCta: { en: 'Call us', ar: 'اتصل بنا' },
    image: img('ev-parking-canopy-night'),
  },
};

// ---------------------------------------------------------------------------
// About page content
// ---------------------------------------------------------------------------

export const about = {
  hero: {
    eyebrow: { en: 'About us', ar: 'من نحن' },
    title: { en: 'Al Sharqiya Gypsum & GRC Group', ar: 'مجموعة الشرقية للجبس والـ GRC' },
    subtitle: {
      en: 'Established 1986 in Al Ain, United Arab Emirates. Gypsum, GRC, flooring, painting and waterproofing across four emirates.',
      ar: 'تأسست عام 1986 في العين، الإمارات العربية المتحدة. الجبس والـ GRC والأرضيات والدهانات والعزل المائي في أربع إمارات.',
    },
    image: img('gypsum-ceiling-installation'),
  },
  sections: [
    {
      heading: { en: 'Where we started', ar: 'من حيث بدأنا' },
      body: {
        en: 'Al-Sharqiya was established in 1986 in Al Ain, United Arab Emirates, specialising in the manufacturing of gypsum and GRC products. The company later expanded its operations to Abu Dhabi and Ajman, building a collection of more than 2,500 unique mould designs and becoming one of the oldest GRG suppliers in the country.',
        ar: 'تأسست الشرقية عام 1986 في العين بالإمارات العربية المتحدة، متخصصةً في تصنيع منتجات الجبس والـ GRC. ثم وسّعت الشركة عملياتها إلى أبوظبي وعجمان، وبَنَت مجموعة تضم أكثر من 2,500 تصميم قالب فريد، وصارت من أقدم موردي الـ GRG في الدولة.',
      },
      image: img('grc-decorative-wave-panel'),
    },
    {
      heading: { en: 'Growing into paints and flooring', ar: 'التوسّع في الدهانات والأرضيات' },
      body: {
        en: 'Following that success, Al-Sharqiya entered the paints sector as both distributor and applicator for leading brands, under the name Art Colors, providing high-quality paint and flooring solutions. Around ten years ago we extended further into the supply and application of decorative materials and professional painting, opening multiple branches to serve a growing customer base across Abu Dhabi, Dubai, Al Ain and Ajman.',
        ar: 'وبعد ذلك النجاح، دخلت الشرقية قطاع الدهانات كموزّع ومنفّذ لعلامات رائدة، تحت اسم Art Colors، لتقدّم حلول دهانات وأرضيات عالية الجودة. وقبل نحو عشر سنوات توسّعنا أكثر في توريد وتنفيذ المواد الزخرفية والدهانات الاحترافية، وافتتحنا فروعاً متعددة لخدمة قاعدة عملاء متنامية في أبوظبي ودبي والعين وعجمان.',
      },
      image: img('painter-applying-roller-coat'),
    },
    {
      heading: { en: 'What we have delivered', ar: 'ما أنجزناه' },
      body: {
        en: 'Over the years we have completed numerous projects covering building painting, flooring systems and waterproofing for commercial, residential and government properties. Recent work includes 10,000 m² of epoxy flooring at the RTA Jebel Ali bus depot, 6,000 m² at Al Quoz, exterior and interior painting for RTA buildings and accommodation, and electric-vehicle charging bays at Ayla Hotel and Bawadi Mall delivered under TAQA instructions.',
        ar: 'أنجزنا على مرّ السنين مشاريع عديدة تشمل دهانات المباني وأنظمة الأرضيات والعزل المائي لعقارات تجارية وسكنية وحكومية. وتشمل أعمالنا الحديثة 10,000 متر مربع من أرضيات الإيبوكسي في مستودع حافلات جبل علي، و6,000 متر مربع في القوز، ودهانات خارجية وداخلية لمباني ومساكن هيئة الطرق والمواصلات، ومواقف شحن للسيارات الكهربائية في فندق أيلا ومركز البوادي نُفِّذت وفق تعليمات طاقة.',
      },
      image: img('bus-depot-epoxy-walkway'),
    },
    {
      heading: { en: 'How we work today', ar: 'كيف نعمل اليوم' },
      body: {
        en: 'We continue to grow and develop in this field, combining long-standing industry experience with high-quality products, professional execution and a commitment to customer satisfaction. Our goal is straightforward: to bring the knowledge, expertise and proven experience of four decades to every client and project we take on.',
        ar: 'نواصل النمو والتطور في هذا المجال، جامعين بين خبرة صناعية راسخة ومنتجات عالية الجودة وتنفيذ احترافي والتزام برضا العميل. وهدفنا واضح: أن نضع معرفة أربعة عقود وخبرتها المُثبتة في خدمة كل عميل وكل مشروع نتولّاه.',
      },
      image: img('office-building-exterior-painting'),
    },
  ],
  milestones: [
    {
      year: '1986',
      title: { en: 'Founded in Al Ain', ar: 'التأسيس في العين' },
      body: {
        en: 'Al-Sharqiya is established as a manufacturer of gypsum and GRC products.',
        ar: 'تأسيس الشرقية كمُصنّع لمنتجات الجبس والـ GRC.',
      },
    },
    {
      year: '1990s–2000s',
      title: { en: 'Expansion and the mould library', ar: 'التوسّع ومكتبة القوالب' },
      body: {
        en: 'Operations extend to Abu Dhabi and Ajman, and the catalogue grows past 2,500 mould designs.',
        ar: 'امتداد العمليات إلى أبوظبي وعجمان، ونمو الكتالوج إلى ما يتجاوز 2,500 تصميم قالب.',
      },
    },
    {
      year: 'c. 2015',
      title: { en: 'Art Colors — paints and flooring', ar: 'Art Colors — الدهانات والأرضيات' },
      body: {
        en: 'The group enters the paints sector as distributor and applicator, adding flooring and decorative materials.',
        ar: 'دخول المجموعة قطاع الدهانات كموزّع ومنفّذ، وإضافة الأرضيات والمواد الزخرفية.',
      },
    },
    {
      year: 'Today',
      title: { en: 'Four emirates, full scope', ar: 'أربع إمارات ونطاق كامل' },
      body: {
        en: 'Gypsum, GRC, flooring, painting, waterproofing and decorative finishes delivered from Abu Dhabi, Dubai, Al Ain and Ajman.',
        ar: 'الجبس والـ GRC والأرضيات والدهانات والعزل المائي والتشطيبات الزخرفية من أبوظبي ودبي والعين وعجمان.',
      },
    },
  ],
};
