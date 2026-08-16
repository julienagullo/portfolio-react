import { useLanguage } from '../../../context/LanguageContext.tsx';
import type { BookAuthorEntry } from '../../../hobbies.ts';
import style from './HobbyContent.module.css';

const ACCENTS = ['blue', 'orange', 'green', 'red', 'yellow', 'purple'] as const;

type AuthorsContentProps = {
  authors: BookAuthorEntry[];
};

export default function AuthorsContent({ authors }: AuthorsContentProps) {
  const { language } = useLanguage();

  return (
    <ul className={style.authorList}>
      {authors.map((entry, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        return (
          <li key={entry.author} className={style.authorItem}>
            <h3 className={`${style.authorName} ${style[accent]}`}>{entry.author}</h3>
            <p className={style.description}>{entry.description[language]}</p>
            <ul className={style.bookGrid}>
              {entry.books.map((book) => (
                <li key={book.title} className={style.bookCard}>
                  {book.image ? (
                    <img className={style.bookCover} src={book.image} alt="" loading="lazy" />
                  ) : (
                    <div className={`${style.bookCoverFallback} ${style[accent]}`} aria-hidden="true" />
                  )}
                  <p className={style.bookTitle}>{book.title}</p>
                  {book.year && <p className={style.bookYear}>{book.year}</p>}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
