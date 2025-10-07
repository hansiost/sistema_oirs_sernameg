export type FaqItem = {
    id: string;
    question: string;
    answer: string;
}

export const mockFaqs: FaqItem[] = [
    {
        id: 'faq-1',
        question: '¿Qué es la OIRS y cuál es su función?',
        answer: 'La Oficina de Información, Reclamos y Sugerencias (OIRS) es el canal oficial de comunicación entre la ciudadanía y SERNAMEG. Su función es facilitar el acceso a la información, recibir y gestionar reclamos, consultas, sugerencias y felicitaciones sobre el quehacer institucional.',
    },
    {
        id: 'faq-2',
        question: '¿Cómo puedo ingresar una solicitud?',
        answer: 'Puede ingresar una solicitud a través de este Portal Ciudadano, utilizando su ClaveÚnica o registrándose con su RUT. También puede hacerlo de forma presencial en nuestras oficinas regionales o a través de otros canales como teléfono o correspondencia.',
    },
    {
        id: 'faq-3',
        question: '¿Cuáles son los plazos de respuesta para una solicitud?',
        answer: 'Los plazos de respuesta varían según el tipo de solicitud. Por ley, el plazo general para dar respuesta a las solicitudes ciudadanas es de 20 días hábiles. Sin embargo, para casos de violencia u otros temas urgentes, se prioriza una gestión más expedita.',
    },
    {
        id: 'faq-4',
        question: '¿Puedo hacer seguimiento a mi solicitud?',
        answer: 'Sí. Una vez que ingresa a este portal con su RUT, en la sección "Mis Solicitudes" podrá ver el listado de todas sus solicitudes y el estado en que se encuentran. Al hacer clic en el número de caso, podrá ver el detalle completo.',
    },
    {
        id: 'faq-5',
        question: '¿Es confidencial la información que entrego?',
        answer: 'Sí. Toda la información personal y los detalles de su solicitud son tratados de manera confidencial, de acuerdo a la Ley N° 19.628 sobre Protección de la Vida Privada. Solo el personal autorizado tendrá acceso a sus datos para gestionar su requerimiento.',
    },
];
