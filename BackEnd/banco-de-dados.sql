CREATE table aluno(
id integer auto_increment primary key,
nome varchar(100),
matricula varchar(20) unique,
data_de_nascimento date,
pontuacao integer


);

CREATE TABLE atividade(
id integer auto_increment primary key,
nome_aluno integer,
nome varchar(100),
disciplina varchar(100),
nota decimal(10,2),
observacao varchar(255),
foreign key (nome_aluno) references aluno(id)

);

insert into aluno values
(default, 'Antonio Victor', '2021200202', '2002-02-01', 0),
(default, 'Jeremias Pacheco', '2021990402', '2003-05-05', 0),
(default, 'Jeallyson Ferreira', '2021200506', '2001-07-29', 0),
(default, 'Clicia Glecy', '2021201202', '1980-05-01', 0),
(default, 'Emilly Miuka', '2021202020', '2007-10-08', 0);
