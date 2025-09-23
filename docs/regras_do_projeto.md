Vamos estabelecer algumas regras para facilitar nossa vida:

Você é o programador, portanto, ao criar ou corrigir um arquivo, você o fará de modo holístico, sempre revise a estrutura e as fundações do projeto, a fim de não se desviar do que foi concebido como ideia inicial e a fim de evitar que você corrija um ponto específico, porém cause problemas em outros pontos por algum efeito cascata.

Sempre que você precisar corrigir um arquivo que já exista no projeto (você sempre se apoiará no arquivo Estrutura.md), você solicitará para mim o arquivo existente, a fim de entendê-lo e conhecer suas implicações e interligações; o analisará e, somente se houver necessidade de alterá-lo, você fara as correções necessárias e entregará aquele arquivo e qualquer outro, corrigido, completo e pronto para substituir o arquivo existente no projeto. Deste modo evitaremos perdas ou retrabalho.

Sempre que você solicitar ou criar um arquivo você deverá listar o caminho onde ele existe ou onde será salvo e fará o mesmo ao atualizá-lo.

FUNDAMENTAL: Você está PROIBIDO de escrever qualquer arquivo, seja criar ou corrigir, sem antes  solicitar permissão de escrever qualquer arquivo.

Você trabalhará sempre no sentido de evitar perdas ou retrabalho. RETRABALHO ZERO é o objetivo, por isso a análise deve ser completa, analisando todas as possibilidades e hipóteses, sem pressa.

Todo e qualquer script deve ser escrito para ser colado e executado diretamente no terminal do power shell

Não usar backticks (```) que não funcionam bem no PowerShell



ENCODING RECOMENDADO: UTF-8 sem BOM



Para arquivos TypeScript (.ts) do projeto SVP v3.0 Enterprise:

PADRÃO CORRETO OBRIGATÓRIO:



UTF-8 sem BOM (Byte Order Mark)

Suporte completo para caracteres portugueses (ç, ã, ô, á, etc.)

Compatibilidade universal com editores, Git, TypeScript compiler



PROBLEMA IDENTIFICADO:

Os caracteres corrompidos como "CondiÃ§Ã£o" indicam conversão incorreta entre encodings:



Texto originalmente em UTF-8 interpretado como Latin-1/Windows-1252

Ou texto Latin-1 sendo forçado em UTF-8



CONFIGURAÇÕES RECOMENDADAS:

Visual Studio Code:

json{

  "files.encoding": "utf8",

  "files.autoGuessEncoding": false

}

PowerShell (ao salvar arquivos):

powershell# Sempre usar UTF-8 sem BOM

Out-File -FilePath "arquivo.ts" -Encoding utf8NoBOM

Git (.gitattributes):

\*.ts text eol=lf encoding=UTF-8

\*.js text eol=lf encoding=UTF-8


E lembre-se que estamos escrevendo código entreprise, portanto deve ser de máxima robustez e qualidade