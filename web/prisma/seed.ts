import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
  await prisma.suivi.deleteMany();
  await prisma.session.deleteMany();
  await prisma.benevole.deleteMany();
  await prisma.formateur.deleteMany();
  await prisma.administrateur.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.thematique.deleteMany();

  const tables = [
    'Thematique', 'Formation', 'Session', 
    'Utilisateur', 'Benevole', 'Formateur', 'Suivi'
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name='${table}'`
    );
  }

  const themaInclusion = await prisma.thematique.create({
    data: {
      title: "Inclusion",
      color: "#F5E7FB",
      colorTitle: "#C87CE9",
      description : "Formez-vous à l'inclusion et à l'accessibilité avec la Fédération Nationale de Protection Civile",
      image : "https://www.comundi.fr/mag-des-competences/wp-content/uploads/2024/10/Inclusion-et-handicap.jpg",
      formations: {
        create: [
          { title: "Inclusion Niveau 1", numero: 1, duration: 3, presentiel: true, description: `
L’inclusion dans l'emploi est un projet de société gouvernemental qui permet aux personnes les plus fragiles de bénéficier de l’accès à l’emploi et à la formation pour s’insérer dans la société par le travail.
&nbsp;
## Nos missions
Ce service facilite la mise en relation des personnes les plus éloignées de l'emploi avec les employeurs inclusifs (SIAE, GEIQ, EA, EATT et facilitateurs de clauses sociales) et les accompagnants (orienteurs et prescripteurs habilités).
&nbsp;
Il offre aux utilisateurs un outil numérique mutualisé pour simplifier les procédures, fluidifier les parcours d'insertion entre professionnels et renforcer la qualité de l'accompagnement des personnes.
&nbsp;
> *Note : Une attestation de fin de formation, vous sera délivrée.*
  `, image : "https://cdn.prod.website-files.com/66952fbab5c04d98f71407d9/686650a26c1d687ec643a7ec_femmes-inclusion-diversite-reunion-rh.jpg" },
          { title: "Inclusion Niveau 2", numero: 2, duration: 1, presentiel: false, description: "Apprenez à accompagner les personnes isolées dans leur quotidien.", image : "https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59910/conversions/EuDTImSoQnWqn6BQBgsqwYSHfYkVza-small.jpg?v=1737022229" },
        ],
      },
    },
    include: {
    formations: true,
  },
  })


  await prisma.thematique.create({
    data: {
      title: "Tolérance",
      color: "#ECF3FC",
      colorTitle: "#7CABE9",
      description : "Formez-vous à la tolérance et à l'inclusion avec la Fédération Nationale de Protection Civile",
      image : "https://jmed-aap.org/wp-content/uploads/2022/07/Foto-Final-22-jui_8-1200x800.jpg",
      formations: {
        create: [
          { title: "Tolérance et Inclusion Niveau 1", numero: 1, duration: 1, presentiel: true, description: `
En tant que formateur de la Fédération Nationale de Protection Civile, vous jouez un rôle crucial dans la promotion de la tolérance et de l'inclusion au sein de notre communauté. Cette formation est conçue pour vous fournir les connaissances et les compétences nécessaires pour sensibiliser efficacement les participants à ces valeurs fondamentales.
&nbsp;
### Objectifs de la formation
- Comprendre les concepts de tolérance et d'inclusion
- Identifier les différentes formes de discrimination et de préjugés
- Apprendre à créer un environnement inclusif et respectueux
- Savoir comment intervenir en cas de comportements discriminatoires
&nbsp;
Rejoignez-nous pour cette formation enrichissante qui vous permettra de devenir un acteur clé dans la promotion de la tolérance et de l'inclusion au sein de la Fédération Nationale de Protection Civile.
Tout d’abord, les participants apprennent à reconnaître les signes de détresse chez un chien et à évaluer la situation pour donner l’alerte rapidement et de manière appropriée.
  `, image : "https://media.licdn.com/dms/image/v2/D4D22AQGI8POhnkvYHw/feedshare-shrink_800/B4DZnZE2CkJcAg-/0/1760283554093?e=2147483647&v=beta&t=_6gEentyhdRJhZ2phsolivvF9JfBSIe0ci5J8L53Iy4" },
          { title: "Tolérance et Inclusion Niveau 2", numero: 2, duration: 5, presentiel: false, description: "Formez-vous à la tolérance et à l'inclusion avec la Fédération Nationale de Protection Civile", image : "https://udd.eu/uploads/2023-08/process-comdef-645a0558404b0428887323-64edade51eb19302549063.webp" },
        ],
      },
    },
    include: {
      formations: true,
    },
  })

  const themaEgalite = await prisma.thematique.create({
    data: {
      title: "Egalité",
      color: "#FFC7C7",
      colorTitle: "#E97C7C",
      description : "Formez-vous à l'égalité professionnelle femmes-hommes avec la Fédération Nationale de Protection Civile",
      image : "https://www.cnfce.com/course/assets/316c548d-ee2a-4c0c-9a63-316928c2f9bc/494c2198-422d-42d5-ba3a-4aa79e43f0a1?size=mobile",
      formations: {
        create: [
          { title: "Egalité hommes femmes", numero: 1, duration: 1, presentiel: true, description: `
Un digital-Learning/formation e-learning pour informer et sensibiliser sur les enjeux de l’égalité professionnelle femmes-hommes, et les moyens d’agir pour faire progresser l’égalité dans les entreprises.
&nbsp;
### Objectifs de la formation
&nbsp;
- Comprendre les enjeux de l’égalité professionnelle femmes-hommes
- Identifier les stéréotypes et les discriminations liés au genre
- Connaître les obligations légales en matière d’égalité professionnelle
- Savoir mettre en place des actions concrètes pour promouvoir l’égalité dans son entreprise
&nbsp;
### Contenu de la formation
&nbsp;
1. Introduction à l’égalité professionnelle femmes-hommes
2. Les stéréotypes et les discriminations liés au genre
3. Les obligations légales en matière d’égalité professionnelle
4. Les actions concrètes pour promouvoir l’égalité dans son entreprise
  `, image : "https://www.cercle-inclusion.com/wp-content/uploads/2025/12/egalite-pro.png" },
        ],
      },
    },
    include: {
      formations: true,
    },
  })

  const hashedPassword = await bcrypt.hash("1234", 10);

  const oceane = await prisma.utilisateur.create({
  data:{
    nom: "Huynh",
    prenom : "Océane",
    email : "oceane@test.com",
    password : hashedPassword,
    date_naissance : new Date("2006-11-07"),
    benevole: {
      create: {}
    }
  }
 })

  const jeanFormateur = await prisma.utilisateur.create({
    data: {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean@formateur.com",
      password: hashedPassword,
      date_naissance: new Date("1985-01-01"),
      type_utilisateur: "FORMATEUR",
      formateur: { create: {} }
    }
  });

  const marieFormatrice = await prisma.utilisateur.create({
    data: {
      nom: "Duponte",
      prenom: "Marie",
      email: "marie@formateur.com",
      password: hashedPassword,
      date_naissance: new Date("1975-07-02"),
      type_utilisateur: "FORMATEUR",
      formateur: { create: {} }
    }
  });

  const hashedPassword2 = await bcrypt.hash("admin", 10);

  // L'Administrateur
  const bossAdmin = await prisma.utilisateur.create({
    data: {
      nom: "Admin",
      prenom: "Le Boss",
      email: "admin@system.com",
      password: hashedPassword2,
      date_naissance: new Date("1990-01-01"),
      type_utilisateur: "ADMINISTRATEUR",
      administrateur: { create: {} }
    }
  });

  const sessionInclusion = await prisma.session.create({
    data: {
      date_deb: new Date("2024-06-01T12:00:00"),
      date_fin: new Date("2024-06-01T15:00:00"),
      presentiel: true,
      lieu: "Centre de Vitry",
      idFormation: themaInclusion.formations[0].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });


    const sessionInclusion2 = await prisma.session.create({
    data: {
      date_deb: new Date("2025-06-01T09:00:00"),
      date_fin: new Date("2025-06-01T10:00:00"),
      presentiel: true,
      lieu: "Gymnase Ivry",
      idFormation: themaInclusion.formations[1].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  const sessionEgalite = await prisma.session.create({
    data: {
      date_deb: new Date("2025-06-01T10:00:00"),
      date_fin: new Date("2025-06-01T11:00:00"),
      presentiel: true,
      lieu: "Centre de secours Paris",
      idFormation: themaEgalite.formations[0].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });

  await prisma.suivi.create({
    data: {
      statut: true,
      idBenevole: oceane.id_utilisateur,
      idSession: sessionInclusion.id_session
    }
  });

    await prisma.suivi.create({
    data: {
      statut: false,
      idBenevole: oceane.id_utilisateur,
      idSession: sessionInclusion2.id_session
    }
  });

  await prisma.suivi.create({
    data: {
      statut: true,
      idBenevole: oceane.id_utilisateur,
      idSession: sessionEgalite.id_session
    }
  });

  // --- THÉMATIQUE ENVIRONNEMENT (3 formations, 1 suivie) ---
  const themaEnvironnement = await prisma.thematique.create({
    data: {
      title: "Environnement",
      color: "#E2FBE2",
      colorTitle: "#4CAF50",
      description: "Agissez pour la planète et comprenez les enjeux climatiques actuels.",
      image: "https://www.vie-publique.fr/files/styles/twitter_image/public/en_bref/image_principale/protection_environnement_constitution_valeur_objectif_219848647_Drupal.jpg?itok=mxgKvIRb",
      formations: {
        create: [
          { title: "Fresque du Climat", numero: 1, duration: 3, presentiel: true, description: "Un atelier ludique pour comprendre les causes et conséquences du dérèglement climatique.", image: "https://www.leparisien.fr/resizer/i-wV5gQIiGQNDoRqEgv9BY5u6i0=/932x582/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/VWMGKFFL6ZDLLNFO5EGVC5SWYQ.jpg" },
          { title: "Zéro Déchet au quotidien", numero: 2, duration: 2, presentiel: false, description: "Apprenez à réduire votre impact environnemental par des gestes simples.", image: "https://img-3.journaldesfemmes.fr/9-KrGwaMJIDIQ4MB535q_v3Zq1U=/1500x/smart/bc7398c0285d48bcab88caf276192457/ccmcms-jdf/39954524.jpg" },
          { title: "Biodiversité locale", numero: 3, duration: 4, presentiel: true, description: "Observer et protéger la faune et la flore de votre région.", image: "https://www.parc-alpilles.fr/wp-content/uploads/sites/2/2020/05/31-mai-sortie-Gue%CC%82piers-c-Yakov-stock.adobe_.com_-1200x630.jpeg" },
        ],
      },
    },
    include: { formations: true },
  });

  // --- THÉMATIQUE CITOYENNETÉ (2 formations, 1 suivie) ---
  const themaCitoyennete = await prisma.thematique.create({
    data: {
      title: "Citoyenneté",
      color: "#FFF4E5",
      colorTitle: "#FF9800",
      description: "Découvrez vos droits, vos devoirs et comment vous impliquer dans la vie de la cité.",
      image: "https://www.solidarite-laique.org/wp-content/uploads/2021/02/shutterstock_1142639114-1024x683.jpg",
      formations: {
        create: [
          { title: "Valeurs de la République", numero: 1, duration: 2, presentiel: true, description: "Comprendre la laïcité et les fondements de notre démocratie.", image: "https://lelephant-larevue.fr/wp-content/uploads/2014/04/La-libert%C3%A9-e1490865010318.jpg" },
          { title: "Engagement Bénévole", numero: 2, duration: 1, presentiel: false, description: "Comment structurer son projet associatif et mobiliser des ressources.", image: "https://infolocale.actu.fr/blog/wp-content/uploads/2025/05/RE-23.png" },
        ],
      },
    },
    include: { formations: true },
  });

  // --- CRÉATION DES SESSIONS ---
  const sessionClimat = await prisma.session.create({
    data: {
      date_deb: new Date("2026-05-10T14:00:00"),
      date_fin: new Date("2026-05-10T17:00:00"),
      presentiel: true,
      lieu: "Maison des Associations, Vitry",
      idFormation: themaEnvironnement.formations[0].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });

  const sessionRepublique = await prisma.session.create({
    data: {
      date_deb: new Date("2026-06-15T09:00:00"),
      date_fin: new Date("2026-06-15T12:00:00"),
      presentiel: true,
      lieu: "Hôtel de Ville, Ivry",
      idFormation: themaCitoyennete.formations[0].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  // --- CRÉATION DES SUIVIS POUR OCÉANE (Statut : false) ---
  await prisma.suivi.create({
    data: {
      statut: false, // Pas encore validé / en cours
      idBenevole: oceane.id_utilisateur,
      idSession: sessionClimat.id_session
    }
  });

  await prisma.suivi.create({
    data: {
      statut: false, // Pas encore validé / en cours
      idBenevole: oceane.id_utilisateur,
      idSession: sessionRepublique.id_session
    }
  });

  // --- NOUVELLES SESSIONS (NON SUIVIES PAR OCÉANE) ---

  // Pour Inclusion Niveau 1
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-07-10T14:00:00"),
      date_fin: new Date("2026-07-10T17:00:00"),
      presentiel: true,
      lieu: "Centre de formation Lyon",
      idFormation: themaInclusion.formations[0].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  // Pour Inclusion Niveau 2
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-07-12T10:00:00"),
      date_fin: new Date("2026-07-12T11:00:00"),
      presentiel: false,
      lieu: "Distanciel (Zoom)",
      idFormation: themaInclusion.formations[1].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });

  // Pour Tolérance Niveau 1
  const themaTolerance = await prisma.thematique.findFirst({ where: { title: "Tolérance" }, include: { formations: true } });
  if (themaTolerance) {
    await prisma.session.create({
      data: {
        date_deb: new Date("2026-08-05T09:00:00"),
        date_fin: new Date("2026-08-05T10:00:00"),
        presentiel: true,
        lieu: "Antenne Marseille",
        idFormation: themaTolerance.formations[0].id_formation,
        idFormateur: jeanFormateur.id_utilisateur
      }
    });

    // Pour Tolérance Niveau 2
    await prisma.session.create({
      data: {
        date_deb: new Date("2026-08-06T14:00:00"),
        date_fin: new Date("2026-08-06T19:00:00"),
        presentiel: false,
        lieu: "E-Learning",
        idFormation: themaTolerance.formations[1].id_formation,
        idFormateur: marieFormatrice.id_utilisateur
      }
    });
  }

  // Pour Egalité
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-09-01T10:00:00"),
      date_fin: new Date("2026-09-01T11:00:00"),
      presentiel: true,
      lieu: "Centre de secours Lille",
      idFormation: themaEgalite.formations[0].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });

  // Pour Environnement (Zéro Déchet)
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-05-20T18:00:00"),
      date_fin: new Date("2026-05-20T20:00:00"),
      presentiel: false,
      lieu: "Webinaire",
      idFormation: themaEnvironnement.formations[1].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  // Pour Environnement (Biodiversité)
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-05-25T14:00:00"),
      date_fin: new Date("2026-05-25T18:00:00"),
      presentiel: true,
      lieu: "Parc Naturel Régional",
      idFormation: themaEnvironnement.formations[2].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });

  // Pour Citoyenneté (Engagement Bénévole)
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-06-20T10:00:00"),
      date_fin: new Date("2026-06-20T11:00:00"),
      presentiel: false,
      lieu: "Plateforme Teams",
      idFormation: themaCitoyennete.formations[1].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  // --- SESSIONS SUPPLÉMENTAIRES (SANS OCÉANE) ---

  // Nouvelle session pour Inclusion Niveau 1 (Session du soir)
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-10-15T18:00:00"),
      date_fin: new Date("2026-10-15T21:00:00"),
      presentiel: true,
      lieu: "Antenne Protection Civile, Bordeaux",
      idFormation: themaInclusion.formations[0].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  // Nouvelle session pour Égalité Hommes Femmes
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-11-05T09:30:00"),
      date_fin: new Date("2026-11-05T10:30:00"),
      presentiel: false,
      lieu: "Visioconférence Google Meet",
      idFormation: themaEgalite.formations[0].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });

  // Nouvelle session pour Fresque du Climat
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-12-12T14:00:00"),
      date_fin: new Date("2026-12-12T17:00:00"),
      presentiel: true,
      lieu: "Mairie de Toulouse",
      idFormation: themaEnvironnement.formations[0].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  // Nouvelle session pour Valeurs de la République
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-09-20T09:00:00"),
      date_fin: new Date("2026-09-20T11:00:00"),
      presentiel: true,
      lieu: "Centre Social, Nantes",
      idFormation: themaCitoyennete.formations[0].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });

  // Session "Rattrapage" pour Zéro Déchet au quotidien
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-12-20T17:00:00"),
      date_fin: new Date("2026-12-20T19:00:00"),
      presentiel: false,
      lieu: "E-Learning Live",
      idFormation: themaEnvironnement.formations[1].id_formation,
      idFormateur: jeanFormateur.id_utilisateur
    }
  });

  // Session de fin d'année pour Biodiversité locale
  await prisma.session.create({
    data: {
      date_deb: new Date("2026-11-18T13:30:00"),
      date_fin: new Date("2026-11-18T17:30:00"),
      presentiel: true,
      lieu: "Réserve Naturelle, Montpellier",
      idFormation: themaEnvironnement.formations[2].id_formation,
      idFormateur: marieFormatrice.id_utilisateur
    }
  });
  }
  

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())