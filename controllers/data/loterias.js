module.exports = {
	loterias: {
		api: {
			'Lotep - PB': 'Lotep (PB)',
			'Maluca - Bahia': 'Bahia - Maluca',
			'Look - GO': 'Look (GO)',
			'Poste da Trevo': 'Trevo Nacional',
			'Aliança Ext. Online': 'Aliança Online'
		},
		federal: 'Federal',
		l_br: 'L-BR',
		lotep_pb: 'Lotep (PB)',
		rio_grande_do_sul: 'Rio Grande do Sul',
		sao_paulo: 'São Paulo',
		lotece: 'Lotece',
		look_go: 'Look (GO)',
		bahia: 'Bahia',
		bahia_maluca: 'Bahia - Maluca',
		popular_recife: 'Popular Recife',
		loteria_nacional: 'Loteria Nacional',
		minas_gerais: 'Minas Gerais',
		rio_de_janeiro: 'Rio de Janeiro',
		trevo: 'Trevo',
		alianca: 'Aliança Online'
	},
	urns: {
		api: {
			federal: 'federal',
			l_br: 'lbr',
			lotep_pb: 'loteppb',
			rio_grande_do_sul: 'riograndesul',
			sao_paulo: 'saopaulo',
			lotece: 'lotece',
			look_go: 'look',
			bahia: 'bahia',
			bahia_maluca: 'malucabahia',
			popular_recife: 'popularrecife',
			loteria_nacional: 'loterianacional',
			minas_gerais: 'minas',
			rio_de_janeiro: 'riojaneiro',
			alianca: 'alianca',
			trevo: 'postetrevo'
		},
		federal: 'federal',
		lbr: 'l_br',
		loteppb: 'lotep_pb',
		riograndesul: 'rio_grande_do_sul',
		saopaulo: 'sao_paulo',
		lotece: 'lotece',
		look: 'look_go',
		bahia: 'bahia',
		malucabahia: 'bahia_maluca',
		popularrecife: 'popular_recife',
		loterianacional: 'loteria_nacional',
		minas: 'minas_gerais',
		riojaneiro: 'rio_de_janeiro',
		alianca: 'alianca',
		postetrevo: 'trevo'
	},
	rgx: {
		hora: /(\d{2}:\d{2})/,
		extracao: /Extração das (\d{2}:\d{2})/,
		premio: /(\d{2,4})\s\((\d{2})\)/,
		grupo: /\((\d{2})\)/
	},
	grupos: {
		1: {
			num: '01',
			nome: 'Avestruz',
			dezenas: ['01', '02', '03', '04'],
			img: 'avestruz.png',
			img128: 'avestruz128.png',
			svg: 'avestruz.svg'
		},
		2: {
			num: '02',
			nome: 'Águia',
			dezenas: ['05', '06', '07', '08'],
			img: 'aguia.png',
			img128: 'aguia128.png',
			svg: 'aguia.svg'
		},
		3: {
			num: '03',
			nome: 'Burro',
			dezenas: ['09', '10', '11', '12'],
			img: 'burro.png',
			img128: 'burro128.png',
			svg: 'burro.svg'
		},
		4: {
			num: '04',
			nome: 'Borboleta',
			dezenas: ['13', '14', '15', '16'],
			img: 'borboleta.png',
			img128: 'borboleta128.png',
			svg: 'borboleta.svg'
		},
		5: {
			num: '05',
			nome: 'Cachorro',
			dezenas: ['17', '18', '19', '20'],
			img: 'cachorro.png',
			img128: 'cachorro128.png',
			svg: 'cachorro.svg'
		},
		6: {
			num: '06',
			nome: 'Cabra',
			dezenas: ['21', '22', '23', '24'],
			img: 'cabra.png',
			img128: 'cabra128.png',
			svg: 'cabra.svg'
		},
		7: {
			num: '07',
			nome: 'Carneiro',
			dezenas: ['25', '26', '27', '28'],
			img: 'carneiro.png',
			img128: 'carneiro128.png',
			svg: 'carneiro.svg'
		},
		8: {
			num: '08',
			nome: 'Camelo',
			dezenas: ['29', '30', '31', '32'],
			img: 'camelo.png',
			img128: 'camelo128.png',
			svg: 'camelo.svg'
		},
		9: {
			num: '09',
			nome: 'Cobra',
			dezenas: ['33', '34', '35', '36'],
			img: 'cobra.png',
			img128: 'cobra128.png',
			svg: 'cobra.svg'
		},
		10: {
			num: '10',
			nome: 'Coelho',
			dezenas: ['37', '38', '39', '40'],
			img: 'coelho.png',
			img128: 'coelho128.png',
			svg: 'coelho.svg'
		},
		11: {
			num: '11',
			nome: 'Cavalo',
			dezenas: ['41', '42', '43', '44'],
			img: 'cavalo.png',
			img128: 'cavalo128.png',
			svg: 'cavalo.svg'
		},
		12: {
			num: '12',
			nome: 'Elefante',
			dezenas: ['45', '46', '47', '48'],
			img: 'elefante.png',
			img128: 'elefante128.png',
			svg: 'elefante.svg'
		},
		13: {
			num: '13',
			nome: 'Galo',
			dezenas: ['49', '50', '51', '52'],
			img: 'galo.png',
			img128: 'galo128.png',
			svg: 'galo.svg'
		},
		14: {
			num: '14',
			nome: 'Gato',
			dezenas: ['53', '54', '55', '56'],
			img: 'gato.png',
			img128: 'gato128.png',
			svg: 'gato.svg'
		},
		15: {
			num: '15',
			nome: 'Jacaré',
			dezenas: ['57', '58', '59', '60'],
			img: 'jacare.png',
			img128: 'jacare128.png',
			svg: 'jacare.svg'
		},
		16: {
			num: '16',
			nome: 'Leão',
			dezenas: ['61', '62', '63', '64'],
			img: 'leao.png',
			img128: 'leao128.png',
			svg: 'leao.svg'
		},
		17: {
			num: '17',
			nome: 'Macaco',
			dezenas: ['65', '66', '67', '68'],
			img: 'macaco.png',
			img128: 'macaco128.png',
			svg: 'macaco.svg'
		},
		18: {
			num: '18',
			nome: 'Porco',
			dezenas: ['69', '70', '71', '72'],
			img: 'porco.png',
			img128: 'porco128.png',
			svg: 'porco.svg'
		},
		19: {
			num: '19',
			nome: 'Pavão',
			dezenas: ['73', '74', '75', '76'],
			img: 'pavao.png',
			img128: 'pavao128.png',
			svg: 'pavao.svg'
		},
		20: {
			num: '20',
			nome: 'Peru',
			dezenas: ['77', '78', '79', '80'],
			img: 'peru.png',
			img128: 'peru128.png',
			svg: 'peru.svg'
		},
		21: {
			num: '21',
			nome: 'Touro',
			dezenas: ['81', '82', '83', '84'],
			img: 'touro.png',
			img128: 'touro128.png',
			svg: 'touro.svg'
		},
		22: {
			num: '22',
			nome: 'Tigre',
			dezenas: ['85', '86', '87', '88'],
			img: 'tigre.png',
			img128: 'tigre128.png',
			svg: 'tigre.svg'
		},
		23: {
			num: '23',
			nome: 'Urso',
			dezenas: ['89', '90', '91', '92'],
			img: 'urso.png',
			img128: 'urso128.png',
			svg: 'urso.svg'
		},
		24: {
			num: '24',
			nome: 'Veado',
			dezenas: ['93', '94', '95', '96'],
			img: 'veado.png',
			img128: 'veado128.png',
			svg: 'veado.svg'
		},
		25: {
			num: '25',
			nome: 'Vaca',
			dezenas: ['97', '98', '99', '00'],
			img: 'vaca.png',
			img128: 'vaca128.png',
			svg: 'vaca.svg'
		}
	}
}
